
/// Represents the game map, including the tiles and buildings on it
function Map() {

    this.buildings      = [];
    this.units          = [];
    
    // The tile player gets to place on map
    this.tileToPlace    = false;
    
    /// The tiles forming the map
    this.grid = new Grid();
}

/// Container for tiles forming the map
function Grid() {
    this.gridArray = [];
    this.get = function(x, y) {
        return this.gridArray[y*yAreaSize+x];
    };
    this.set = function(x, y, tile) {
        this.gridArray[y*yAreaSize+x] = tile;
    };
    this.getCenter = function() {
        return this.gridArray[Math.floor(yAreaSize / 2)*yAreaSize+Math.floor(xAreaSize / 2)];
    };
}

Grid.prototype.getTileCount = function()
{
    var count = 0;
    for (var i = 0; i < this.gridArray.length; i++) {
        if (this.gridArray[i]) count++;
    }
    //console.log("Tile count on grid: " + count);
    return count;
};

//Make sure to have both of these at startup
var berriesGenerated = false;
var shroomsGenerated = false;

/// Reset the map and populate it with initial tiles and buildings
Map.prototype.reset = function()
{
    // Create starting area with berries and mushrooms
    do {
        this.grid    = new Grid();
        this.buildings = [];
        this.units   = [];
        berriesGenerated = false;
        shroomsGenerated = false;
        this.raiseLand(Math.floor(xAreaSize / 2), Math.floor(yAreaSize / 2), 100, true);
    } while (!!!berriesGenerated || !!!shroomsGenerated);
    
    // Add some units for player
    var homeTile = this.grid.getCenter();
    if (homeTile && homeTile.building) {
        homeTile.building.owner = playerLocal;
        
        // Spawn two gatherers
        homeTile.building.spawnUnits(2);
        
        // Set player home tile
        playerLocal.homeTile = homeTile;
    }
    
    // The first tile player gets to place is a bear cave
    this.tileToPlace = new Tile(tileTypes[5]);
    if (this.tileToPlace.building) {
        this.tileToPlace.building.owner = playerAI;
    }
};

//Simple recursive random map generation for game start
Map.prototype.raiseLand = function(x, y, resume, startPoint) {
    //console.log("x: " + x + " y: " + y + " res: " + resume + " start: " + startPoint);
    if      (x >= 0 && y >= 0 && x < xAreaSize && y < yAreaSize             // check map dimensions
            && (this.grid.get(x, y) == false || !this.grid.get(x, y) )      // check that the place is empty
            && Math.random() * 100.0 < resume)                              // check whether to stop expanding the map
    {
        // Get random tile if not startPoint
        var type;
        if (startPoint) { type = tileTypes[6]; }
        else {
            // Really simple type randomization
            var rand = Math.random() * 100.0;
            if (rand < 40) { type = tileTypes[0]; }
            else if (rand < 70) { type = tileTypes[1]; }
            else if (rand < 90) { type = tileTypes[2]; }
            else if (rand < 95) { type = tileTypes[3]; shroomsGenerated = true;}
            else { type = tileTypes[4]; berriesGenerated = true;}
        }
        //console.log("New tile: " + type.name);
        var tile = new Tile(type);
        tile.setPosition(this.grid, x, y);
        
        // Recursion to every direction
        this.raiseLand(x - 1, y, resume - 15, false);
        this.raiseLand(x + 1, y, resume - 15, false);
        this.raiseLand(x, y - 1, resume - 15, false);
        this.raiseLand(x, y + 1, resume - 15, false);
    }
};

/// Draws the map and everything on it. 
Map.prototype.draw = function(drawContext) {

    removeNonExistentObjects(this.grid.gridArray, false);
    removeNonExistentObjects(this.buildings, true);
    removeNonExistentObjects(this.units, true);

    // Draw all objects
    var objects = this.grid.gridArray.concat(this.buildings).concat(this.units);
    for (var i = 0; i < objects.length; i++) {
        if (!objects[i]) continue;
        //objects[i].animate();
        objects[i].draw(drawContext, xOffset, yOffset);
    }
};

/// Returns the neighbour tiles of the tile located at (x, y)
Map.prototype.neighbours = function(x, y) {
    var table = [];
    if (x > 0 && this.grid.get(x - 1, y)) {
        table.push(this.grid.get(x - 1, y));
    }
    if (y > 0 && this.grid.get(x, y - 1)) {
        table.push(this.grid.get(x, y - 1));
    }
    if (x < (xAreaSize - 1) && this.grid.get(x + 1, y)) {
        table.push(this.grid.get(x + 1, y));
    }
    if (y < (yAreaSize - 1) && this.grid.get(x, y + 1)) {
        table.push(this.grid.get(x, y + 1));
    }
    return table;
};

/// Move all units
Map.prototype.control = function() {
    for (var i = 0; i < this.units.length; i++) {
        var object = this.units[i];
        object.control();
    }  
    for (var i = 0; i < this.buildings.length; i++) {
        var object = this.buildings[i];
        object.control();
    }  
};

Map.prototype.getObjectAtPoint = function(x, y) {
    for (var i = 0; i < this.grid.gridArray.length; i++) {
        var object = this.grid.gridArray[i];
        
        if (object && object.exists && object.containsPoint(x,y)) {
            return object;
        }
    }
    return false;
};

Map.prototype.newTileToPlace = function() {
    // Don't try to give a new tile to place if game area is full
    var maxTiles = xAreaSize * yAreaSize;
    if (this.grid.getTileCount() >= maxTiles) {
        this.tileToPlace = false;
        return;
    }
    
    // Create a random tile
    var cValue = Math.random() * tileIncidenceSum;
    
    // Simple weighted randomization
    var i = 0;
    while (cValue > tileTypes[i].incidence) {
        cValue -= tileTypes[i].incidence;
        i++;
    }
    
    // Tile type selected, set it
    this.tileToPlace = new Tile(tileTypes[i]);
    
    if (this.tileToPlace.building) {
        this.tileToPlace.building.owner = playerAI;
    }
    
};

function removeNonExistentObjects(objects, splice) {
    for (var i = 0; i < objects.length; i++) {
        // Remove object if marked destroyed
        if ( objects[i] && !!! objects[i].exists) {
            if (splice) {
                objects.splice(i, 1);
                i--;
            } else {
                objects[i] = null;
            }
        }
    }
}

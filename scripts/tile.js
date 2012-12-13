// TileType "class"
function TileType(image, name, buildable, passability, berries, shrooms, buildingType, incidence)
{
    // constructor values
    this.image          = image;
    this.name           = name;
    this.buildable      = buildable;
    this.passability    = passability;
    this.berries        = berries;
    this.shrooms        = shrooms;
    this.buildingType   = buildingType;
    this.incidence      = incidence;
}

// Tile "class"
function Tile(tileType)
{
    // these values are default
    this.x              = 0.0;
    this.y              = 0.0;
    this.exists         = true;     // Switch this to false to destroy object
    this.width          = tileSize;
    this.height         = tileSize;
    
    this.units          = [];
    
    // Pathfinding help values
    this.f_score        = 0.0;
    this.g_score        = 0.0;
    this.previousTile   = false;
    
    // Set values from constructor
    this.name           = tileType.name;
    this.image          = new Image();
    this.image.src      = tileType.image;
    this.image.onload   = this.imageOnload;
    this.buildable      = tileType.buildable;
    this.passability    = tileType.passability;
    this.berries        = tileType.berries;
    this.shrooms        = tileType.shrooms;
    
    // Add to drawn objects
    objects.push(this);
    
    if (tileType.buildingType) {
        this.building       = new Building(tileType.buildingType, 0);
        this.building.tile  = this;
        objects.push(this.building);
    } else {
        this.building       = false;
    }
    this.incidence      = tileType.incidence;
}

/*
 *  Tile methods
 */

Tile.prototype.imageOnload = function() {
    // Create offscreen canvas for image
    /*var m_canvas    = document.createElement("canvas");
    m_canvas.width  = this.width;
    m_canvas.height = this.height;
    var m_context   = m_canvas.getContext("2d");
    
    m_context.drawImage(this.image, 0, 0);
    this.image = m_canvas;*/
};
Tile.prototype.setPosition = function(x, y) {
    // If Tiles can be moved at some point, first remove from grid
    
    // Given position is tile position, not pixel position
    this.x  = x * this.width;
    this.y  = y * this.height;
    
    // Position the building also
    if (this.building) {
        this.building.setPosition(this.x, this.y);
    }
    
    // Mark tile to grid
    grid[y*yAreaSize+x] = this;
};
Tile.prototype.containsPoint = function(x, y) {
    if (x < this.x
        || y < this.y
        || x > this.x + this.width
        || y > this.y + this.height) {
        return false;
    }
    return true;
};
Tile.prototype.setPixelPosition = function(x, y) {
    this.x  = x;
    this.y  = y;
};
Tile.prototype.animate = function() {};
Tile.prototype.draw = function(context, xOffset, yOffset) {
    // Only draw if the image is on screen
    if (this.x + this.width > xOffset
        && this.y + this.height > yOffset
        && this.x < xOffset + xCanvasSize
        && this.y < yOffset + yCanvasSize) {
        context.drawImage(this.image, this.x - xOffset, this.y - yOffset, this.width, this.height);
    }
};
Tile.prototype.changeOwner = function (newOwner) { 
    if (this.building) {
        this.building.owner = newOwner;
    }
};
Tile.prototype.coordinates = function() {
    return { x:this.x / this.width, y:this.y / this.height };
};
Tile.prototype.gridIndex = function() {
    return this.y*yAreaSize+this.x;
};
Tile.prototype.distanceScoreTo = function(tile) {
    return (this.x - tile.x)^2 + (this.y - tile.y)^2;
};
Tile.prototype.distanceTo = function(tile) {
    return Math.sqrt((this.x - tile.x)^2 + (this.y - tile.y)^2) / tileSize;
};
Tile.prototype.neighbours = function() {
    var table = [];
    if (this.x > 0 && grid[this.y*yAreaSize+(this.x - 1)]) {
        table.push(grid[this.y*yAreaSize+(this.x - 1)]);
    }
    if (this.y > 0 && grid[(this.y - 1)*yAreaSize+this.x]) {
        table.push(grid[(this.y - 1)*yAreaSize+this.x]);
    }
    if (this.x < (xAreaSize - 1) && grid[this.y*yAreaSize+(this.x + 1)]) {
        table.push(grid[this.y*yAreaSize+(this.x + 1)]);
    }
    if (this.y < (yAreaSize - 1) && grid[(this.y + 1)*yAreaSize+this.x]) {
        table.push(grid[(this.y + 1)*yAreaSize+this.x]);
    }
    return table;
};

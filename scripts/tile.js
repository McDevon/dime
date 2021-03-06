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
    this.xGrid          = 0;
    this.yGrid          = 0;
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
    
    this.building       = false;
    
    if (tileType.buildingType) {
        this.building       = new Building(tileType.buildingType, playerAI);
        this.building.tile  = this;
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
Tile.prototype.setPosition = function(grid, x, y) {
    // If Tiles can be moved at some point, first remove from grid
    
    // Given position is tile position, not pixel position
    this.x  = x * this.width;
    this.y  = y * this.height;
    
    this.xGrid = x;
    this.yGrid = y;
    
    // Position the building also
    if (this.building) {
        this.building.setPosition(this.x, this.y);
    }
    
    // Mark tile to grid
    if (grid) {
        grid.set(x, y, this);
        // Add buildings to map here, as their drawing is done elsewhere until they are added to the grid
        if (this.building) map.buildings.push(this.building);
    }
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
Tile.prototype.draw = function(drawContext, xOffset, yOffset) {
    // Only draw if the image is on screen
    if (this.x + this.width > xOffset
        && this.y + this.height > yOffset
        && this.x < xOffset + xCanvasSize
        && this.y < yOffset + yCanvasSize) {
        drawContext.drawImage(this.image, this.x - xOffset, this.y - yOffset, this.width, this.height);
    }
};
Tile.prototype.changeOwner = function (newOwner) { 
    if (this.building) {
        this.building.owner = newOwner;
    }
};
Tile.prototype.coordinates = function() {
    return { x:this.xGrid, y:this.yGrid };
    //return { x:this.x / this.width, y:this.y / this.height };
};
Tile.prototype.gridIndex = function() {
    return this.yGrid*yAreaSize+this.xGrid;
};
Tile.prototype.distanceScoreTo = function(tile) {
    return Math.pow(this.x - tile.x, 2) + Math.pow(this.y - tile.y, 2);
};
Tile.prototype.distanceTo = function(tile) {
    return Math.sqrt(Math.pow(this.xGrid - tile.xGrid, 2) + Math.pow(this.yGrid - tile.yGrid, 2));
};
Tile.prototype.neighbours = function() {
    return map.neighbours(this.xGrid, this.yGrid);
};

Tile.prototype.displayInfo = function() {
    $("#tile_info").css({
        position: "absolute",
        left: (currentCanvasXOffset() + 50) + "px",
        top: (currentCanvasYOffset() + 50) + "px"
    });
    $("#tile_type").text(this.name);
    $("#building_info_frame").hide();
    $("#start_building").hide();
    $("#cannot_build").hide();
    $("#tile_resource_info").hide();

    if (this.building) {
        $("#building_name").text(this.building.buildingType.name);
        $("#building_image").attr("src", this.building.image.src);

        // Show building hp
        var buildingData = '<p>Hp: ' + this.building.hp + ' / ' + this.building.totalHP + '</p>';
        document.getElementById("building_data").innerHTML = buildingData;
        
        // Show spawnable unit(s)
        var unitData = "";
        if (this.building.buildingType.spawnedUnit && this.building.owner === playerLocal) {
            var unitType = this.building.buildingType.spawnedUnit;
            unitData += '<p><button onclick="buyUnit()"';
            if (playerLocal.berries < unitType.berryCost || playerLocal.shrooms < unitType.shroomCost)
                 unitData += ' disabled="disabled" ';
            unitData += '>Buy</button><img src="' + unitType.image + '" /><span class="tile_info_value">' + unitType.name + '</span>, cost: ';
            if (unitType.berryCost > 0)
                unitData += ' Berries: ' + unitType.berryCost;
            if (unitType.shroomCost > 0)
                unitData += ' Mushrooms: ' + unitType.shroomCost;
            unitData += '</p>';
        }
        
        document.getElementById("buy_unit").innerHTML = unitData;
        
        $("#building_info_frame").show();
    } else if (this.buildable) {
        $("#start_building").show();
        
        // Create a list of buildable buildings
        var buildingList = "";
        for (var i = 0; i < buildingTypes.length; i++) {
            if (buildingTypes[i].playerCanBuild) {
                buildingList += '<p><button onclick="constructBuilding(\'' + buildingTypes[i].name + '\')"';
                if (playerLocal.berries < buildingTypes[i].berryCost || playerLocal.shrooms < buildingTypes[i].shroomCost)
                     buildingList += ' disabled="disabled" ';
                buildingList += '>Build</button><span class="tile_info_value">' + buildingTypes[i].name + '</span>, cost: ';
                if (buildingTypes[i].berryCost > 0)
                    buildingList += ' Berries: ' + buildingTypes[i].berryCost;
                if (buildingTypes[i].shroomCost > 0)
                    buildingList += ' Mushrooms: ' + buildingTypes[i].shroomCost;
                buildingList += '</p>';
            }
        }
        document.getElementById("construction_list").innerHTML = buildingList;
    } else {
        $("#cannot_build").show();
    }
    
    if (this.berries > 0 || this.shrooms > 0) {
        if (this.berries > 0) {
            $("#tile_resource_type").text("Berries");
            $("#tile_resource_count").text(Math.floor(this.berries));
        } else {
            $("#tile_resource_type").text("Mushrooms");
            $("#tile_resource_count").text(Math.floor(this.shrooms));
        }
        $("#tile_resource_info").show();
    }

    $("#tile_info").show();
    
    // Select this tile
    map.selectedTile = this;
};

Tile.prototype.displaySelectionInfo = function() {
    $("#selection_info").css({
        position: "absolute",
        left: (currentCanvasXOffset() + 10) + "px",
        top: (currentCanvasYOffset() + 10) + "px"
    });
    $("#placed_tile_type").text(this.name);
    $("#selection_info").show();
};

function closeSelectionInfo() {
    $("#selection_info").hide();
};

function closeTileInfo() {
    $("#tile_info").hide();
}

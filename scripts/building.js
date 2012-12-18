// Buildings are spawners, gathering points, shops, defence towers, etc..
function BuildingType(image, name, hp, spawnedUnit, spawningRate, spawningCost, gatherBerries, gatherShrooms, fireRate, firePower, playerCanBuild, berryCost, shroomCost)
{
    this.image          = image;
    this.name           = name;
    this.hp             = hp;
    this.spawnedUnit    = spawnedUnit;
    this.spawningRate   = spawningRate;
    this.spawningCost   = spawningCost;
    this.gatherBerries  = gatherBerries;
    this.gatherShrooms  = gatherShrooms;
    this.fireRate       = fireRate;
    this.firePower      = firePower;
    this.playerCanBuild = playerCanBuild;
    this.berryCost      = berryCost;
    this.shroomCost     = shroomCost;
}

function Building(buildingType, owner) {
    // these values are default
    this.x              = 0.0;
    this.y              = 0.0;
    this.exists         = true;     // Switch this to false to destroy object
    this.width          = tileSize / 2.0;
    this.height         = tileSize / 2.0;
    this.tile           = false;
    this.spawnTimer     = 0.0;
    this.defence        = 0;

    // Seconds since the last time under attack.
    // Let's start with an arbitrary big value in order to
    // avoid specialized handling when no fighting has occurred yet.
    this.fightTimer    = 10000.0;
    
    this.image          = new Image();
    this.image.src      = buildingType.image;
    this.image.onload   = this.imageOnload;
    
    // Constructor values
    this.hp             = buildingType.hp;
    this.totalHP        = buildingType.hp;
    this.buildingType   = buildingType;
    this.owner          = owner;
}

Building.prototype.draw = objectDraw;

Building.prototype.setPosition = function(x, y) {
    // Given position is pixel position
    this.x  = x + tileSize / 4;
    this.y  = y + tileSize / 4;
};
Building.prototype.imageOnload = function() {
    // Create offscreen canvas for image
    /*var m_canvas    = document.createElement("canvas");
    m_canvas.width  = this.width;
    m_canvas.height = this.height;
    var m_context   = m_canvas.getContext("2d");
    
    m_context.drawImage(this.image, 0, 0);
    this.image = m_canvas;*/
};
Building.prototype.containsPoint = function(x, y) {
    if (x < this.x
        || y < this.y
        || x > this.x + this.width
        || y > this.y + this.height) {
        return false;
    }
    return true;
};
Building.prototype.spawnUnits = function(amount) {
    
    // Do nothing if there is no unit to spawn
    if (  !!! this.tile || !!! this.buildingType.spawnedUnit ) {
        return;
    }
    
    // Spawn amount units
    for (var i = 0; i < amount; i++) {
        
        // Create a unit
        var unit = new Unit(this.buildingType.spawnedUnit, this.owner);
        
        var target = unit.createRelativePoint(this.tile);
        
        // Position the unit
        unit.x = this.tile.x + target.x;
        unit.y = this.tile.y + target.y;
        
        unit.tile = this.tile;
        
        // Give the unit a home
        /*if (this.owner && this.owner.homeTile) {
            unit.homeTile = this.owner.homeTile;
        } else {*/
        unit.homeTile = this.tile;
        //}
        
        map.units.push(unit);
    }
    
}; 

Building.prototype.animate = function() {};

Building.prototype.control = function() {
    this.spawnTimer += refreshRate;
    this.fightTimer += refreshRate;
    
    // Spawn units when it's time
    if (this.spawnTimer >= 1.0 / this.buildingType.spawningRate) {
        this.spawnUnits(1);
        this.spawnTimer = 0;
    }
};

function constructBuilding(building) {
    if (map.selectedTile
        && map.selectedTile.building === false
        && map.selectedTile.buildable === true) {
        // Get building type
        var type = false;
        for (var i = 0; i < buildingTypes.length; i++) {
            if (buildingTypes[i].name === building) {
                type = buildingTypes[i];
                break;
            }
        }
        if (!!! type)
            return;
        
        if (playerLocal.berries < type.berryCost || playerLocal.shrooms < type.shroomCost)
            return;
        
        if (type.berryCost > 0)
            playerLocal.berries -= type.berryCost;
        if (type.shroomCost > 0)
            playerLocal.shrooms -= type.shroomCost;
        
        var building = new Building(type, playerLocal);
            
        map.selectedTile.building = building;
        building.tile = map.selectedTile;
        
        building.setPosition(map.selectedTile.x, map.selectedTile.y);
        map.buildings.push(building);
        
        closeTileInfo();
        
    }
}

// Buildings are spawners, gathering points, shops, defence towers, etc..
function BuildingType(image, name, hp, spawnedUnit, spawningRate, spawningCost, gatherBerries, gatherShrooms, fireRate, firePower)
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
}

function Building(buildingType, owner) {
    // these values are default
    this.x              = 0.0;
    this.y              = 0.0;
    this.exists         = true;     // Switch this to false to destroy object
    this.width          = tileSize / 2.0;
    this.height         = tileSize / 2.0;

    this.image          = new Image();
    this.image.src      = buildingType.image;
    this.image.onload   = this.imageOnload;
    
    // Constructor values
    this.buildingType   = buildingType;
    this.owner          = owner;
}

Building.prototype.draw = function(context, xOffset, yOffset) {
    // Only draw if the image is on screen
    if (this.x + this.width > xOffset
        && this.y + this.height > yOffset
        && this.x < xOffset + xCanvasSize
        && this.y < yOffset + yCanvasSize) {
        context.drawImage(this.image, this.x - xOffset, this.y - yOffset, this.width, this.height);
    }
};
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

Building.prototype.animate = function() {};

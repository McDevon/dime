function UnitType(image, name, hp, speed, attack, defence)
{
    this.image      = image;
    this.name       = name;
    this.hp         = hp;
    this.speed      = speed;
    this.attack     = attack;
    this.defence    = defence;
}

function Unit(unitType, owner)
{
    // these values are default
    this.x              = 0.0;
    this.y              = 0.0;
    this.exists         = true;     // Switch this to false to destroy object
    this.width          = tileSize / 4.0;
    this.height         = tileSize / 4.0;
    this.tile           = false;    // The tile this unit is currently on

    this.image          = new Image();
    this.image.src      = unitType.image;
    this.image.onload   = this.imageOnload;
    
    // Add to drawn objects
    objects.push(this);
    
    // Constructor values
    this.hp             = unitType.hp;
    this.unitType       = unitType;
    this.owner          = owner;
}

Unit.prototype.imageOnload = function() {
    // Create offscreen canvas for image
    /*var m_canvas    = document.createElement("canvas");
    m_canvas.width  = this.width;
    m_canvas.height = this.height;
    var m_context   = m_canvas.getContext("2d");
    
    m_context.drawImage(this.image, 0, 0);
    this.image = m_canvas;*/
};
Unit.prototype.draw = function(context, xOffset, yOffset) {
    // Only draw if the image is on screen
    if (this.x + this.width > xOffset
        && this.y + this.height > yOffset
        && this.x < xOffset + xCanvasSize
        && this.y < yOffset + yCanvasSize) {
        context.drawImage(this.image, this.x - xOffset, this.y - yOffset, this.width, this.height);
    }
};
Unit.prototype.setPosition = function(x, y) {
    // Given position is pixel position
    this.x  = x;
    this.y  = y;
};
Unit.prototype.containsPoint = function(x, y) {
    if (x < this.x
        || y < this.y
        || x > this.x + this.width
        || y > this.y + this.height) {
        return false;
    }
    return true;
};
Unit.prototype.createRelativePoint = function(tile) {
    // Create a random point on a tile outside the possible building.
    
    var x, y;
    
    if (tile.building) {
        var a = Math.random() * tileSize;
        var b = Math.random() * tileSize / 4;
        
        if (Math.random() < 0.5) { b += tileSize * (3/4); }
        if (Math.random() < 0.5) { x = a, y = b; }
        else { x = b, y = a; }
    } else {
        x = Math.random() * tileSize;
        y = Math.random() * tileSize;
    }
    
    // Center the image to the point
    x -= this.width / 2;
    y -= this.height / 2;
    
    return {x:Math.floor(x), y:Math.floor(y)};
};

Unit.prototype.animate = function() {};

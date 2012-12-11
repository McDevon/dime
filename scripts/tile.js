// TileType "class"
function TileType(image, name, buildable, passability, berries, shrooms, spawner, spawnerRate, incidence)
{
    // constructor values
    this.image          = image;
    this.name           = name;
    this.buildable      = buildable;
    this.berries        = berries;
    this.shrooms        = shrooms;
    this.spawner        = spawner;
    this.spawnerRate    = spawnerRate;
}

// Tile "class"
function Tile(image, name)
{
    // these values are default
    this.x              = 0.0;
    this.y              = 0.0;
    this.exists         = true;     // Switch this to false to destroy object
    this.width          = tileSize;
    this.height         = tileSize;
    
    // Set values from constructor
    this.name           = name;
    this.image          = new Image();
    this.image.src      = image;
    this.image.onload   = this.imageOnload;
}

/*
 *  Tile methods
 */

Tile.prototype.imageOnload = function() {};
Tile.prototype.setPosition = function(x, y) {
        // If Tiles can be moved at some point, first remove from grid
        
        // Given position is tile position, not pixel position
        this.x  = x * this.width;
        this.y  = y * this.height;
        
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

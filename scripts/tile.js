// Tile "class"
function Tile(image, name)
{
    // these values are default
    this.x              = 0.0;
    this.y              = 0.0;
    this.exists         = true;     // Switch this to false to destroy object
    
    // Set values from constructor
    this.width          = tileSize;
    this.height         = tileSize;
    this.name           = name;
    this.image          = new Image();
    this.image.src      = image;
    this.image.onload   = this.imageOnload;

}

/*
 *  Tile methods
 */

Tile.prototype.imageOnload = imageOnload;
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
    context.drawImage(this.image, this.x - xOffset, this.y - yOffset, this.width, this.height);
};
    
// Nothing needs to be done here as drawing is done in the main loop    
function imageOnload() {
    //console.log("image loaded");
}

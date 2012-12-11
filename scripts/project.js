// Game settings
var refreshRate = 1/30;     // Canvas refresh rate in seconds
var tileSize    = 80;       // Tile size

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
        // Given position is tile position, not pixel position
        this.x  = x * this.width;
        this.y  = y * this.height;
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
Tile.prototype.draw = function(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
};
    
// Nothing needs to be done here as drawing is done in the main loop    
function imageOnload() {
    //console.log("image loaded");
}

// Canvas
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

// Getting mouse position on canvas
function currentCanvasXOffset() {
    var obj = canvas;
    var curX = 0;
    if (obj.offsetParent) {
        do {
            curX += obj.offsetLeft;
        } while (obj = obj.offsetParent);
    }
    return curX;
}
function currentCanvasYOffset() {
    var obj = canvas;
    var curY = 0;
    if (obj.offsetParent) {
        do {
            curY += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return curY;
}
function currentMouseXPosition(e) {
	if (!e) var e = window.event;
	if (e.pageX)
		return e.pageX;
	else if (e.clientX) 	{
		return e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	}
    return 0;
}
function currentMouseYPosition(e) {
	if (!e) var e = window.event;
	if (e.pageY)
		return e.pageY;
	else if (e.clientY)
		return e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    return 0;
}

// Wait for loading to finish, then let's go
jQuery(document).ready(function() {
    resetGame();
    setInterval(mainLoop, refreshRate * 1000);
});

/* 
 *  All drawn objects live in 'objects' array
 *  The 'grid' is the game map
 */
var objects = [];
var grid    = [];

// Reset canvas area
function resetGame() {
	context.clearRect(0,0,canvas.getAttribute("width"),canvas.getAttribute("height"));
	
    objects = [];
    
    // Objects
    var tile1 = new Tile("images/land2.png", "Sweden");
    var tile2 = new Tile("images/land1.png", "Norway");
    var tile3 = new Tile("images/land1.png", "Denmark");
    
    // These positions are grid positions
    tile1.setPosition(3, 1);
    tile2.setPosition(1, 2);
    tile3.setPosition(4, 1);
    
    objects.push(tile1);
    objects.push(tile2);
    objects.push(tile3);
}

var clickedObject = null;

// Check for mouse clicks
canvas.onmousedown = function(e) {
	var x = currentMouseXPosition(e) - currentCanvasXOffset();
	var y = currentMouseYPosition(e) - currentCanvasYOffset();
	
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        
        // Remove object if clicked on it
        if (object.exists && object.containsPoint(x,y)) {
            clickedObject = object;
        }
    }    
}
canvas.onmouseup = function(e) {
	var x = currentMouseXPosition(e) - currentCanvasXOffset();
	var y = currentMouseYPosition(e) - currentCanvasYOffset();
	
    if (clickedObject != null && clickedObject.containsPoint(x,y)) {
        clickedObject.exists = false;
    }
    clickedObject = null;
}

// Main animation loop
function mainLoop() {
	// Clear the canvas
	context.clearRect(0,0,canvas.getAttribute("width"),canvas.getAttribute("height"));

    // Draw all objects
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        
        // Remove object if marked destroyed
        if ( !!! object.exists) {
            objects.splice(i, 1);
            i--;
        }
        // Animate and draw object if it exists
        else {
            object.animate();
            object.draw(context);
        }
    }
}


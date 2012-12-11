// Game settings
var refreshRate = 1/30;     // Canvas refresh rate in seconds
var tileSize    = 80;       // Tile size
var xAreaSize   = 20;       // Game area size
var yAreaSize   = 20;

// Game state as global variables
var gameTime    = 0.0;
var xOffset     = 0.0;
var yOffset     = 0.0;

// Canvas
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");


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

/*
 *  Main animation loop
 */

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


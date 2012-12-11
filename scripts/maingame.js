// Canvas
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

// Game settings
var refreshRate = 1/30;     // Canvas refresh rate in seconds
var tileSize    = 80;       // Tile size
var xAreaSize   = 20;       // Game area size in tiles
var yAreaSize   = 20;
var xCanvasSize = canvas.getAttribute("width");
var yCanvasSize = canvas.getAttribute("height");

// Game state as global variables
var gameTime    = 0.0;

// Visual state
var xOffset     = 0.0;
var yOffset     = 0.0;
var borders     = [false, false, false, false]; // Stoppers for left, up, right, down.

// Different tile areas
    //  TileType (image, name, buildable, passability, berries, shrooms, spawner, spawnerRate, incidence)
    //  UnitType (name, hp, speed, attack, defence, enemy)
var tileTypes = [
    new TileType("images/land2.png", "grass", true, 100, 0, 0, false, 0, 80),
    new TileType("images/land2.png", "plains", true, 90, 0, 0, false, 0, 60),
    new TileType("images/land1.png", "mountain", false, 20, 0, 0, false, 30),
    new TileType("images/land1.png", "mushroom forest", false, 60, 0, 10, false, 20),
    new TileType("images/land1.png", "berry forest", false, 60, 10, 0, false, 20),
    new TileType("images/land2.png", "bear forest", false, 60, 5, 0, new UnitType("bear", 100, 0.3, 10, 5, true), 10),
    ];

// Wait for loading to finish, then let's go
jQuery(document).ready(function() {
    resetGame();
    mainLoop();
    //setInterval(mainLoop, refreshRate * 1000);
    draw();
});

/* 
 *  All drawn objects live in 'objects' array
 *  The 'grid' is the game map
 */
var objects = [];
var grid    = [];

// Reset canvas area
function resetGame() {
	context.clearRect(0,0,xCanvasSize,yCanvasSize);
	
    objects = [];
    
    // Reset game state
    gameTime    = 0.0;
    xOffset     = (tileSize * xAreaSize) / 2 - (xCanvasSize / 2);
    yOffset     = (tileSize * yAreaSize) / 2 - (yCanvasSize / 2);
    borders     = [false, false, false, false];
    
    // Objects
    var tile1 = new Tile("images/land2.png", "Sweden");
    var tile2 = new Tile("images/land1.png", "Norway");
    var tile3 = new Tile("images/land1.png", "Denmark");
    
    for (var i = 5; i < 15; i++) {
        for (var j = 5; j < 15; j++) {
            var tile = new Tile("images/land1.png", "Mark" + (i + j*15));
            tile.setPosition(i, j);
            objects.push(tile);
        }
    }
    
    // These positions are grid positions
    tile1.setPosition(3, 1);
    tile2.setPosition(1, 2);
    tile3.setPosition(4, 1);
    
    objects.push(tile1);
    objects.push(tile2);
    objects.push(tile3);
}

var clickedObject = null;

/*
 *  Main animation loop
 */

function mainLoop() {
    gameTime += refreshRate;
    mouseRefresh = true;
    draw();
    
    // Recall mainLoop after refreshRate seconds
    setTimeout(mainLoop, 1000 * refreshRate);
}

function draw() {
    // Canvas buffer
    var m_canvas    = document.createElement("canvas");
    m_canvas.width  = xCanvasSize;
    m_canvas.height = yCanvasSize;
    var m_context   = m_canvas.getContext("2d");
    
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
            object.draw(m_context, xOffset, yOffset);
        }
    }
    
    drawBorders(m_context);
    drawCursor(m_context);
    
    // Move buffer to canvas
	context.clearRect(0,0,xCanvasSize,yCanvasSize);
    canvas.width = canvas.width;
    
    context.drawImage(m_canvas, 0, 0);
}

function drawBorders(context) {
    // red
    context.fillStyle = "#FF0000";
    
    // Draw border stoppers
    if (borders[0] == true) {
        context.fillRect(0,0,3,yCanvasSize);
    }
    if (borders[1] == true) {
        context.fillRect(0,0,xCanvasSize,3);
    }
    if (borders[2] == true) {
        context.fillRect(xCanvasSize - 3,0,3,yCanvasSize);
    }
    if (borders[3] == true) {
        context.fillRect(0,yCanvasSize - 3,xCanvasSize,3);
    }
}

function drawCursor(context) {
    // blue
    context.strokeStyle = "#0000FF";
    
    // Draw current square
    context.lineWidth = 5;
    
    // Get position
    var xPos = xMouse - xMouse % tileSize;
    var yPos = yMouse - yMouse % tileSize;
    
    // Draw tile
    context.moveTo(xPos - xOffset,yPos - yOffset);
    context.lineTo(xPos - xOffset + tileSize,yPos - yOffset);
    context.lineTo(xPos - xOffset + tileSize,yPos - yOffset + tileSize);
    context.lineTo(xPos - xOffset,yPos - yOffset + tileSize);
    context.lineTo(xPos - xOffset,yPos - yOffset - 2.5);
    context.stroke();

}


// Canvas
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

// Game settings
var refreshRate = 1/20;     // Canvas refresh rate in seconds
var tileSize    = 80;       // Width/height of a tile in pixels
var xAreaSize   = 21;
var yAreaSize   = 21;

var xCanvasSize = canvas.getAttribute("width");
var yCanvasSize = canvas.getAttribute("height");

// Create the game area. Parameters: tileSize, width, height
var map = new Map();

// Game state as global variables
var gameTime    = 0.0;
var selecting   = false;    // true when timer is paused and user is selecting place for next tile

var playerLocal = false;
var playerAI    = false;

// Visual state
var xOffset     = 0.0;
var yOffset     = 0.0;
var borders     = [false, false, false, false]; // Stoppers for left, up, right, down.

// Different unit types
var unitTypes = [
    new UnitType("images/villager.png", "gatherer", 50, 1, 10, 5, 20),
    new UnitType("images/bear.png", "bear", 100, 0.5, 20, 5, 0),
    ];

// Different building types
var buildingTypes = [
    new BuildingType ("images/bearcave.png", "bear cave", 2000, unitTypes[1], 0.1, 0, false, false, 0, 0),
    new BuildingType ("images/tower.png", "defence tower", 500, false, 0, 0, false, false, 1, 20),
    new BuildingType ("images/towncenter.png", "town hub", 5000, unitTypes[0], 0, 10, true, true, 2, 10),
    new BuildingType ("images/berryhut.png", "berry hut", 1000, false, 0, 0, true, false, 0, 0),
    new BuildingType ("images/shroomhut.png", "shroom basket", 1000, false, 0, 0, false, true, 0, 0),
    ];

// Different tile areas
    //  TileType (image, name, buildable, passability, berries, shrooms, spawner, spawnerRate, incidence)
    //  UnitType (name, hp, speed, attack, defence)
    //  BuildingType (name, hp, spawnedUnit, spawningRate, spawningCost, gatherBerries, gatherShrooms, fireRate, firePower)
var tileTypes = [
    new TileType("images/land2.png", "grass", true, 100, 0, 0, false, 80),
    new TileType("images/plains.png", "plains", true, 90, 0, 0, false, 60),
    new TileType("images/mountain.png", "mountain", false, 20, 0, 0, false, 30),
    new TileType("images/shroomforest.png", "mushroom forest", false, 60, 0, 1000, false, 20),
    new TileType("images/berryforest.png", "berry forest", false, 60, 1000, 0, false, 20),
    new TileType("images/forest.png", "bear forest", false, 60, 5, 0, buildingTypes[0], 10),
    new TileType("images/land1.png", "start tile", true, 100, 0, 0, buildingTypes[2], 0),
    ];

// Count sum of tile incidences for randomization calculations
var tileIncidenceSum = 0;
for (var i = 0; i < tileTypes.length; i++) {
    tileIncidenceSum += tileTypes[i].incidence;
}
//console.log("Tile Incidence sum: " + tileIncidenceSum);

// Make sure to have this function in use with all browsers
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 * refreshRate);
          };
})();

// Reset canvas area
function resetGame() {
	context.clearRect(0,0,xCanvasSize,yCanvasSize);
    
    // Reset game state
    gameTime    = 0.0;
    xOffset     = (tileSize * xAreaSize) / 2 - (xCanvasSize / 2);
    yOffset     = (tileSize * yAreaSize) / 2 - (yCanvasSize / 2);
    borders     = [false, false, false, false];
    
    playerLocal = new Player("player");
    playerAI    = new Player("AI");
    
    // Starting resources
    playerLocal.berries = 100;
    playerLocal.shrooms = 100;
    
    // Build the map
    map.reset();
    
}

var clickedObject = null;

/*
 *  Main animation loop
 */

function mainLoop() {
    
    // Refresh timer and run the game (not when waiting for player to place a tile)
    if (!selecting) {
        gameTime += refreshRate;
        map.moveUnits();
    }
        
    // Give chance to put the next tile somewhere
    if (gameTime % 60 == 0) {
        selecting = true;
    }
    
    // Recall mainLoop after refreshRate seconds
    setTimeout(mainLoop, 1000 * refreshRate);
}

function draw() {
    // Start by requesting the next frame to get as close to max fps as possible
    requestAnimFrame(draw);
    
    mouseRefresh = true;

    // Canvas buffer
    var m_canvas    = document.createElement("canvas");
    m_canvas.width  = xCanvasSize;
    m_canvas.height = yCanvasSize;
    var m_context   = m_canvas.getContext("2d");
    
    map.draw(m_context);
    drawBorders(m_context);
    drawCursor(m_context);
    
    playerLocal.drawInfo(document.getElementById('player_name'),
            document.getElementById('berry_count'),
            document.getElementById('mushroom_count'));

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

// Wait for loading to finish, then let's go
jQuery(document).ready(function() {
    resetGame();
    mainLoop();
    //setInterval(mainLoop, refreshRate * 1000);
    draw();
});

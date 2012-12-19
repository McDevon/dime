var mouseDown = false;
var xMouseStart = 0.0;
var yMouseStart = 0.0;
var xMousePrevious = 0.0;
var yMousePrevious = 0.0;
var xMouse      = 0.0;
var yMouse      = 0.0;

var mouseRefresh = true;

// Mouse position calculation
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

// Check for mouse clicks
document.getElementById("game").onmousedown = function(e) {
	var x = currentMouseXPosition(e) - currentCanvasXOffset();
	var y = currentMouseYPosition(e) - currentCanvasYOffset();
	
    var object = map.getObjectAtPoint(x + xOffset, y + yOffset);
    if (object) clickedObject = object;
    
    mouseDown = true;
    
    // Set previous mouse position
    xMouseStart = x;
    yMouseStart = y;
    
    xMousePrevious = x;
    yMousePrevious = y;
    
};

document.getElementById("game").onmouseup = function(e) {
	var x = currentMouseXPosition(e) - currentCanvasXOffset();
	var y = currentMouseYPosition(e) - currentCanvasYOffset();
	
	// Separate clicks from drags
    if (Math.abs(x - xMouseStart) < 5
        && Math.abs(y - yMouseStart) < 5) {
        
        // Selecting a place for a new tile
        if (selecting) {
            var xTile = Math.floor((xMouse - xMouse % tileSize) / tileSize);
            var yTile = Math.floor((yMouse - yMouse % tileSize) / tileSize);
            // Check if position is usable, i.e. empty and has some other tile next to it
            if (!map.grid.get(xTile, yTile) && map.neighbours(xTile, yTile).length > 0) {
                // Put tile to grid
                map.tileToPlace.setPosition(map.grid, xTile, yTile);
                // Generate new random tile to place next time
                map.newTileToPlace();
                // Hide info text
                closeSelectionInfo();
                // Done selecting, resume game
                selecting = false;
                // Audio effect too
                audioEffects[0].play();
                
            }
        }
        // Clicking a tile
        else if (clickedObject != null
            && clickedObject.containsPoint(x + xOffset,y + yOffset))
        {
            clickedObject.displayInfo();
        }
    }
};

document.getElementById("game").onselectstart = function(){ return false; };

document.onmouseup = function(e) {
    clickedObject = null;
    mouseDown = false;
    // Reset cursor
    document.body.style.cursor = 'default';
};

document.onmousemove = function(e) {
    //e.preventDefault();

    if (mouseRefresh) {
        var x = currentMouseXPosition(e) - currentCanvasXOffset();
        var y = currentMouseYPosition(e) - currentCanvasYOffset();
    
        // Scroll game area with mouse
        if (mouseDown) {
            
            xOffset += xMousePrevious - x;
            yOffset += yMousePrevious - y;
            
            // Constrains
            if (xOffset <= 0) {xOffset = 0; borders[0] = true;}
            else {borders[0] = false;}
            if (xOffset >= xAreaSize * tileSize - xCanvasSize) {xOffset = xAreaSize * tileSize - xCanvasSize; borders[2] = true;}
            else {borders[2] = false;}
            if (yOffset <= 0) {yOffset = 0; borders[1] = true;}
            else {borders[1] = false;}
            if (yOffset >= yAreaSize * tileSize - yCanvasSize) {yOffset = yAreaSize * tileSize - yCanvasSize; borders[3] = true;}
            else {borders[3] = false;}
        
            if (!borders[0] && !borders[2]) {xMousePrevious = x;}
            if (!borders[1] && !borders[3]) {yMousePrevious = y;}
        
            // Change cursor if not clicking
            if (Math.abs(x - xMouseStart) < 5
                && Math.abs(y - yMouseStart) < 5) {
                document.body.style.cursor = 'move';
            }
            //console.log("x off: " + xOffset + ", y off: " + yOffset);
        }
        
        // Get mouse position on game area
        xMouse = xOffset + x;
        yMouse = yOffset + y;
                
        mouseRefresh = false;
    }
};

//adding the event listerner for Mozilla
if(window.addEventListener) {
    document.getElementById("game").addEventListener('DOMMouseScroll', mouseScroll, false);
}

//for IE/OPERA etc
document.getElementById("game").onmousewheel = mouseScroll;

function mouseScroll(e)
{
    //console.log(e);
    // Clear mouse events
    clickedObject = null;
    mouseDown = false;

    var delta = 0;
 
    if (!e) e = window.event;
 
    // normalize the delta
    if (e.wheelDelta) {
        // IE and Opera
        delta = e.wheelDelta / 60;
 
    } else if (e.detail) {
        // W3C
        delta = -e.detail / 2;
    }
    
    yOffset -= delta * 10;
    
    // Avoid flickering on Safari
    yOffset = Math.floor(yOffset);
    
    if (yOffset <= 0) {yOffset = 0; borders[1] = true;}
    else {borders[1] = false;}
    if (yOffset >= yAreaSize * tileSize - yCanvasSize) {yOffset = yAreaSize * tileSize - yCanvasSize; borders[3] = true;}
    else {borders[3] = false;}

}

// Testing some iPad controls
document.getElementById("game").addEventListener('touchmove', ipadScroll, false);
document.getElementById("game").ontouchstart = function(e){ 
    xPadPrev = false;
    yPadPrev = false;
};

var xPadPrev = false;
var yPadPrev = false;

function ipadScroll(e) {
    // Disable normal ipad scrolling
    e.preventDefault();
    
    clickedObject = null;
    mouseDown = false;

    var xDelta = 0;
    var yDelta = 0;
    
    if (!e) e = window.event;
 
    if (e.pageX && e.pageY) {
        if (xPadPrev) {
            xDelta = xPadPrev - e.pageX;
            yDelta = yPadPrev - e.pageY;
        }
        xPadPrev = e.pageX;
        yPadPrev = e.pageY;
    }
    
    yOffset += yDelta;
    xOffset += xDelta;
    
    // Avoid flickering on Safari
    yOffset = Math.floor(yOffset);
    xOffset = Math.floor(xOffset);
    
    // Constrains
    if (xOffset <= 0) {xOffset = 0; borders[0] = true;}
    else {borders[0] = false;}
    if (xOffset >= xAreaSize * tileSize - xCanvasSize) {xOffset = xAreaSize * tileSize - xCanvasSize; borders[2] = true;}
    else {borders[2] = false;}
    if (yOffset <= 0) {yOffset = 0; borders[1] = true;}
    else {borders[1] = false;}
    if (yOffset >= yAreaSize * tileSize - yCanvasSize) {yOffset = yAreaSize * tileSize - yCanvasSize; borders[3] = true;}
    else {borders[3] = false;}
}

var mouseDown = false;
var xMouseStart = 0.0;
var yMouseStart = 0.0;

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
	
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        
        // Remove object if clicked on it
        if (object.exists && object.containsPoint(x,y)) {
            clickedObject = object;
        }
    }    
    
    mouseDown = true;
    
    // Set previous mouse position
    xMouseStart = x;
    yMouseStart = y;
}

document.getElementById("game").onmouseup = function(e) {
	var x = currentMouseXPosition(e) - currentCanvasXOffset();
	var y = currentMouseYPosition(e) - currentCanvasYOffset();
	
    if (clickedObject != null && clickedObject.containsPoint(x,y)) {
        clickedObject.exists = false;
    }
}

document.onmouseup = function(e) {
    clickedObject = null;
    mouseDown = false;
}

document.onmousemove = function(e) {
    // Scroll game area with mouse
    if (mouseDown) {
	    var x = currentMouseXPosition(e) - currentCanvasXOffset();
	    var y = currentMouseYPosition(e) - currentCanvasYOffset();
	    
        xOffset += xMouseStart - x;
        yOffset += yMouseStart - y;
        
        // Constrains
        if (xOffset <= 0) {xOffset = 0; borders[0] = true;}
        else {borders[0] = false;}
        if (xOffset >= xAreaSize * tileSize - xCanvasSize) {xOffset = xAreaSize * tileSize - xCanvasSize; borders[2] = true;}
        else {borders[2] = false;}
        if (yOffset <= 0) {yOffset = 0; borders[1] = true;}
        else {borders[1] = false;}
        if (yOffset >= yAreaSize * tileSize - yCanvasSize) {yOffset = yAreaSize * tileSize - yCanvasSize; borders[3] = true;}
        else {borders[3] = false;}
    
        if (!borders[0] && !borders[2]) {xMouseStart = x;}
        if (!borders[1] && !borders[3]) {yMouseStart = y;}
    
        //console.log("x off: " + xOffset + ", y off: " + yOffset);
    }
}


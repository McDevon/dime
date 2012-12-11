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

/*
 * Getting mouse position on canvas
 */
 
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


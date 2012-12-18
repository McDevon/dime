///
/// Common stuff for Building and Unit. Not actual inheritance for now, but probably should be.
///

function objectDraw(context, xOffset, yOffset) {
    // Only draw if the image is on screen
    if (this.x + this.width > xOffset
        && this.y + this.height > yOffset
        && this.x < xOffset + xCanvasSize
        && this.y < yOffset + yCanvasSize) {
        context.drawImage(this.image, this.x - xOffset, this.y - yOffset, this.width, this.height); 
        if (this.fightTimer < 3.0) {
            drawHpBar(this.hp / this.totalHP, context,
                    this.x - xOffset, this.y - yOffset - 10); // Draw 10 pixels above the object
        } 
    }
}

function drawHpBar(hpLeft, context, x, y) {
    var barLength = 30;
    var barThickness = 3;
    var leftLength = Math.floor(hpLeft*barLength);
    var lostLength = barLength - leftLength;
    context.fillStyle = "#00FF00";
    context.fillRect(x, y, leftLength, barThickness);
    context.fillStyle = "#FF0000";
    context.fillRect(x + leftLength, y, lostLength, barThickness);
};

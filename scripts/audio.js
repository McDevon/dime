// Audio effect class
function AudioEffect(file)
{
    this.file       = file;
    this.element    = false;
}

AudioEffect.prototype.load = function() {
    
    this.element = document.createElement('audio');
    //document.getElementById('game').appendChild(this.element);
    
    // Create both mp3 and ogg sources
    var mpSource = document.createElement('source');
    mpSource.setAttribute('src', this.file + ".mp3");
    mpSource.setAttribute('type', "audio/mpeg");
    var ogSource = document.createElement('source');
    ogSource.setAttribute('src', this.file + ".ogg");
    ogSource.setAttribute('type', "audio/ogg");

    this.element.appendChild(mpSource);
    this.element.appendChild(ogSource);
    this.element.load();
    
    this.element.volume = 1;
};

AudioEffect.prototype.play = function() {
    if (!!! this.element)
        return;
        
    this.element.play();
};
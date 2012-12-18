// Audio effect class
function AudioEffect(file)
{
    this.file       = file;
    this.element    = false;
}

AudioEffect.prototype.load = function() {
    this.element = document.createElement('audio');
    this.element.setAttribute('src', this.file);
    this.element.load();
    
    this.element.volume = 1;
};

AudioEffect.prototype.play = function() {
    if (!!! this.element)
        return;
        
    this.element.play();
};
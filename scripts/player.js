// Player class
function Player(name) {
    this.name = name;
    
    // Resources
    this.berries =  0;
    this.shrooms =  0;
    
    // Home base
    this.homeTile = false;
    
    // Preference for gatherer action
    this.gathererPreference = 0;    // 0 = none, 1 = berries, 2 = shrooms, 3 = building.
}

/// Displays information on the player.
/// This should be called whenever information needs to be redrawn.
/// Parameters name, berry and mushroom specify the elements whose innerHTML will be used for displaying the info
Player.prototype.drawInfo = function(name, berry, mushroom) {
	name.innerHTML = this.name;
	berry.innerHTML = this.berries;
	mushroom.innerHTML = this.shrooms;
};

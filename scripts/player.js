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
    
    // Unit counts
    this.gatherers = 0;
    this.soldiers = 0;
}

/// Displays information on the player.
/// This should be called whenever information needs to be redrawn.
/// Parameters name, berry and mushroom specify the elements whose innerHTML will be used for displaying the info
Player.prototype.drawInfo = function(name, berry, mushroom, gatherer, soldier) {
	name.text(this.name);
	berry.text(this.berries);
	mushroom.text(this.shrooms);
	gatherer.text(this.gatherers);
	soldier.text(this.soldiers);
};

Player.prototype.unitAdded = function(unit) {
    if (unit.unitType.name == "Gatherer") {
        this.gatherers++;
    } else if (unit.unitType.name == "Soldier") {
        this.soldiers++;
    }
};

Player.prototype.unitDestroyed = function(unit) {
    if (unit.unitType.name == "Gatherer") {
        this.gatherers--;
    } else if (unit.unitType.name == "Soldier") {
        this.soldiers--;
    }
};

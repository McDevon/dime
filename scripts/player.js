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

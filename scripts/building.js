// Buildings are spawners, gathering points, shops, defence towers, etc..
function BuildingType(image, name, hp, spawnedUnit, spawningRate, spawningCost, gatherBerries, gatherShrooms, fireRate, firePower)
{
    this.image          = image;
    this.name           = name;
    this.hp             = hp;
    this.spawnedUnit    = spawnedUnit;
    this.spawningRate   = spawningRate;
    this.spawningCost   = spawningCost;
    this.gatherBerries  = gatherBerries;
    this.gatherShrooms  = gatherShrooms;
    this.fireRate       = fireRate;
    this.firePower      = firePower;
}

function Building(buildingType, owner) {
    this.buildingType   = buildingType;
    this.owner          = owner;
}

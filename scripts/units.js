function UnitType(image, name, hp, speed, attack, defence, maxResources)
{
    this.image      = image;
    this.name       = name;
    this.hp         = hp;
    this.speed      = speed;
    this.attack     = attack;
    this.defence    = defence;
    this.maxResources = maxResources;
}

function Unit(unitType, owner)
{
    // these values are default
    this.x              = 0.0;
    this.y              = 0.0;
    
    this.berries        = 0;
    this.shrooms        = 0;
    
    this.collectSpeed   = 5;    // Collect speed of items / sec
    this.repairSpeed    = 10;   // Speed of reapiring and building buildings. hp / sec
    
    // Movement
    this.xSpeed         = 0.0;
    this.ySpeed         = 0.0;
    this.xTarget        = 0.0;
    this.yTarget        = 0.0;
    this.distance       = 0.0;
    this.targetTile     = false;
    this.targetReached  = true;
    
    this.exists         = true;     // Switch this to false to destroy object
    this.width          = tileSize / 4.0;
    this.height         = tileSize / 4.0;
    this.tile           = false;    // The tile this unit is currently on
    this.homeTile       = false;
    
    this.path           = false;    // Designated movement path

    this.image          = new Image();
    this.image.src      = unitType.image;
    this.image.onload   = this.imageOnload;
    
    // Add to drawn objects
    //objects.push(this);
    
    // Constructor values
    this.hp             = unitType.hp;
    this.unitType       = unitType;
    this.owner          = owner;
}

Unit.prototype.imageOnload = function() {
    // Create offscreen canvas for image
    /*var m_canvas    = document.createElement("canvas");
    m_canvas.width  = this.width;
    m_canvas.height = this.height;
    var m_context   = m_canvas.getContext("2d");
    
    m_context.drawImage(this.image, 0, 0);
    this.image = m_canvas;*/
};
Unit.prototype.draw = function(context, xOffset, yOffset) {
    // Only draw if the image is on screen
    if (this.x + this.width > xOffset
        && this.y + this.height > yOffset
        && this.x < xOffset + xCanvasSize
        && this.y < yOffset + yCanvasSize) {
        context.drawImage(this.image, this.x - xOffset, this.y - yOffset, this.width, this.height);
    }
};
Unit.prototype.setPosition = function(x, y) {
    // Given position is pixel position
    this.x  = x;
    this.y  = y;
};
Unit.prototype.containsPoint = function(x, y) {
    if (x < this.x
        || y < this.y
        || x > this.x + this.width
        || y > this.y + this.height) {
        return false;
    }
    return true;
};
Unit.prototype.createRelativePoint = function(tile) {
    // Create a random point on a tile outside the possible building.
    
    var x, y;
    
    if (tile.building) {
        var a = Math.random() * tileSize;
        var b = Math.random() * tileSize / 4;
        
        if (Math.random() < 0.5) { b += tileSize * (3/4); }
        if (Math.random() < 0.5) { x = a, y = b; }
        else { x = b, y = a; }
    } else {
        x = Math.random() * tileSize;
        y = Math.random() * tileSize;
    }
    
    // Center the image to the point
    x -= this.width / 2;
    y -= this.height / 2;
    
    return {x:Math.floor(x), y:Math.floor(y)};
};

Unit.prototype.animate = function() {};

// AI pass for object, also the moving happens here
Unit.prototype.control = function() {

    // Gatherer ai
    if (this.unitType.name == "Gatherer") {
        
        // First, watch for enemies. If one found in same tile, return to base, unless already at base or going there
        if (this.targetTile !== this.homeTile) {
            for (var i = 0; i < this.tile.units.length; i++) {
                var unit = this.tile.units[i];
                if (unit.owner !== this.owner) {
                    // Gotta run if not at home base
                    if (this.tile.building && this.tile.building.buildingType.name == "town hub") {
                        return; // At home, do nothing
                    }
                    if (this.homeTile) {
                        this.path = this.generatePathTo(this.homeTile);
                        this.targetTile = this.homeTile;
                    }
                }
            }
        }
        
        // Second, if no target is set, choose either build, berry or shroom target
        if (!!! this.targetTile) {
            // Target area type (1 = berries, 2 = shrooms, 3 = buildings)
            var targetAreaType = this.owner.gathererPreference;
            var iter = 3;
            this.path = false;
            
            // If no user preference, pick something by yourself
            if (targetAreaType == 0) {
            
                var bestResource = Math.max(this.owner.berries, this.owner.shrooms);
                
                // Check for which resource to search for
                if (Math.abs(this.owner.berries - this.owner.shrooms) < bestResource / 2) {
                    if (Math.random() < 0.5)
                        targetAreaType = 1;
                    else
                        targetAreaType = 2;
                }
                else if (this.owner.shrooms > this.owner.berries) {
                    targetAreaType = 1;
                } else {
                    targetAreaType = 2;
                }
            }
                    
            // Check if wanted type of place can be found
            while (!this.path && iter > 0) {
                if (targetAreaType <= 0) { targetAreaType = 3; }
                switch (targetAreaType) {
                    case 1:
                        this.path = this.getPathToNearestTile(function(target) { return target.berries > 0; });
                        break;
                    case 2:
                        this.path = this.getPathToNearestTile(function(target) { return target.shrooms > 0; });
                        break;
                    case 3:
                        this.path = this.getPathToNearestTile(function(target) { return (target.building
                                                                                && target.building.hp < target.building.buildingType.hp); });
                        break;
                }
                targetAreaType--;
                iter--; // Don't stay in this loop. If there is nothing to do, do nothing.
            }
            
            if (this.path) {
                this.targetTile = this.path[this.path.length - 1];
            }

        }
        
        // Move, if on route
        if (!!! this.targetReached) {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            
            this.distance -= refreshRate * tileSize * (this.path[0].passability / 100) * this.unitType.speed;
            
            if (this.distance <= 0) {
                this.targetReached = true;
                
                // Remove unit from previous tile and add to current tile
                for (var i = 0; i < this.tile.units.length; i++) {
                    if (this.tile.units[i] === this) {
                        this.tile.units.splice[i,1];
                        break;
                    } 
                }
                
                // Remove tile from path
                if (this.path.length > 0) {
                    
                    // TODO: Could change current tile when crossing the tile line.
                    this.path[0].units.push(this);
                    this.tile = this.path[0];
                    
                    this.path.splice(0,1);
                }
                
             }
        }
        
        // Third, if target is set and not there but unit reached some tile, start moving towards target via route calculated
        if (this.targetReached && this.targetTile && this.targetTile !== this.tile) {
            var nextTile = this.path[0];
            
            // Get new target point in next square
            var target = this.createRelativePoint(this.path[0]);
            
            this.xTarget = nextTile.x + target.x;
            this.yTarget = nextTile.y + target.y;
            
            this.targetReached = false;
            
            var angle = Math.atan2(this.yTarget - this.y, this.xTarget - this.x);
            this.xSpeed = refreshRate * tileSize * this.unitType.speed * (nextTile.passability / 100) * Math.cos(angle);
            this.ySpeed = refreshRate * tileSize * this.unitType.speed * (nextTile.passability / 100) * Math.sin(angle);
            
            this.distance = Math.sqrt(Math.pow(this.xTarget - this.x, 2) + Math.pow(this.yTarget - this.y, 2));
        }
        
        // Stop if at target
        if (this.targetReached && this.targetTile && this.targetTile === this.tile) {
            if (this.xSpeed > 0.0 || this.ySpeed > 0.0) {
                this.xSpeed = 0.0;
                this.ySpeed = 0.0;
            }
            
            var gathering = false;
            
            // If at target and needs to drop, drop
            if (this.tile.building && this.tile.building.buildingType.gatherShrooms && this.shrooms > 0.0) {
                this.owner.shrooms += this.shrooms;
                this.shrooms = 0;
                this.targetTile = false;    // Get new target next time
            }
            if (this.tile.building && this.tile.building.buildingType.gatherBerries && this.berries > 0.0) {
                this.owner.berries += this.berries;
                this.berries = 0;
                this.targetTile = false;    // Get new target next time
            }
                
            // Fourth, if at target and needs to collect, collect
            // TODO: Gather in chunks, not decimals
            if (this.tile.shrooms > 0.0 && this.shrooms + this.berries < this.unitType.maxResources) {
                // If this somehow gets the value past maxResources, doesn't matter.
                this.tile.shrooms -= this.collectSpeed * refreshRate;
                this.shrooms += this.collectSpeed * refreshRate;
                gathering = true;
            } else if (this.tile.berries > 0.0 && this.shrooms + this.berries < this.unitType.maxResources) {
                // If this somehow gets the value past maxResources, doesn't matter.
                this.tile.berries -= this.collectSpeed * refreshRate;
                this.berries += this.collectSpeed * refreshRate;
                gathering = true;
            }
            
            // If full, go to nearest drop building
            if (gathering && (this.shrooms + this.berries >= this.unitType.maxResources
                || (this.tile.shrooms <= 0.0 && this.tile.berries <= 0.0))) {
                if (this.shrooms > 0.0) {
                    this.path = this.getPathToNearestTile(function(target) { return (target.building
                                                                                    && target.building.buildingType.gatherShrooms); });
               }
                else if (this.berries > 0.0) {
                    this.path = this.getPathToNearestTile(function(target) { return (target.building
                                                                                    && target.building.buildingType.gatherBerries); });
                }
                if (this.path) {
                    this.targetTile = this.path[this.path.length - 1];
                }
            }
            
            // Fifth, if at target and needs to build, start building
            if (this.tile.building
                && this.tile.building.owner === this.owner
                && this.tile.building.hp < this.tile.building.buildingType.hp) {
                // If dropped something here, this needs to be checked
                if (this.targetTile === false) {
                    this.targetTile = this.tile;
                }
                
                this.tile.building.hp += this.repairSpeed * refreshRate;
                
                // When done, figure out something else to do
                if (this.tile.building.hp >= this.tile.building.buildingType.hp) {
                    
                    this.tile.building.hp = this.tile.building.buildingType.hp;
                    this.targetTile = false;
                }
            }
            // If doing nothing here, get next instructions
            else if (!gathering) {
                this.targetTile = false;
            }
        }
    }
    
    // Attacker ai
    else {
        
    }
};

// Pathfinding to target (A*)
Unit.prototype.generatePathTo = function(goal) {

    var startTile = this.tile;

    var closed  = [];
    var open    = [startTile];
    var startIndex;
    var nodes = [];
    
    // Create an array of tiles
    for (var i = 0; i < map.grid.gridArray.length; i++) {
        if (map.grid.gridArray[i]) {
            nodes.push(grid[i]);
            map.grid.gridArray[i].f_score = goal.distanceTo(map.grid.gridArray[i]);
            map.grid.gridArray[i].g_score = startTile.distanceTo(map.grid.gridArray[i]);
            map.grid.gridArray[i].previousTile = false;
        }
    }
    
    startTile.g_score = 0;
        
    while (nodes.length > 0) {
        var current = false;
        // Get node with lowest score
        for (var i = 0; i < nodes.length; i++) {
            if (!current) {
                current = nodes[i];
            } else if (current.f_score > nodes[i].f_score) {
                current = nodes[i];
            }
        }
        // If target found, we're done here
        if (current === goal) {
            return this.reconstructPathTo(goal);
        }
        // Remove target from nodes
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i] === current) {
                nodes.splice(i, 1);
                break;
            }
        }
        // Add current to closed
        closed.push(current);
        var neighbours = current.neighbours();
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
            
            // Check if this tile is already closed
            var inClosed = false;
            for (var j = 0; j < closed.length; j++) {
                if (neighbour === closed[j]) {
                    inClosed = true;
                    break;
                }
            }
            if (inClosed) { continue; }
            
            // Weighted distance to neighbour
            var t_g = current.g_score + (100 / neighbour.passability);
            
            var inOpen = false;
            // Check whether found in open set
            for (var j = 0; j < open.length; j++) {
                if (open[j] === neighbour) {
                    inOpen = true;
                    break;
                }
            }
            
            // This is currently best path
            if (!inOpen || t_g <= neighbour.g_score) {
                neighbour.previousTile = current;
                neighbour.g_score = t_g;
                neighbour.f_score = t_g + goal.distanceTo(neighbour);
                if (!inOpen) {
                    open.push(neighbour);
                }
            }
        }        
    }
    
    return false;
};

// Dijkstra of finding a target type of tile (could have been integrated to A*)
Unit.prototype.getPathToNearestTile = function(isTarget) {
    var startTile = this.tile;
    var nodes = [];
    var target = false;
    
    // Create an array of tiles
    for (var i = 0; i < map.grid.gridArray.length; i++) {
        if (map.grid.gridArray[i]) {
            nodes.push(map.grid.gridArray[i]);
            map.grid.gridArray[i].g_score = 100001;       // Close enough
            map.grid.gridArray[i].previousTile = false;
        }
    }
    
    startTile.g_score = 0;
    
    while (nodes.length > 0) {
        var current = false;
        // Get node with lowest score
        for (var i = 0; i < nodes.length; i++) {
            if (!current) {
                current = nodes[i];
            } else if (current.g_score > nodes[i].g_score) {
                current = nodes[i];
            }
        }
        
        // Remove target from nodes
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i] === current) {
                nodes.splice(i, 1);
                break;
            }
        }
        
        if (current.g_score > 100000) {
            break;
        }
        var neighbours = current.neighbours();
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
                       
            // Weighted distance to neighbour
            var t_g = current.g_score + (100 / neighbour.passability);
            

            // This is currently best path
            if (t_g < neighbour.g_score) {
                neighbour.previousTile = current;
                neighbour.g_score = t_g;
            }
        }          
        // If given target type is found, we're done here
        if (isTarget(current)) {
            target = current;
            break;
        }
        
    }
    
    if (target) {
        return this.reconstructPathTo(target);
    } else { return false; }
};

Unit.prototype.reconstructPathTo = function(goal) {
    var current = goal;
    var path = [];
    while (current && current !== this.tile) {
        path.push(current);
        current = current.previousTile;
    }
    return path.reverse();
};


class Monster {
  constructor(tile, sprite, hp) {
    this.move(tile);
    this.sprite = sprite;
    this.hp = hp;
  }

  draw() {
    draw_sprite(this.sprite, this.tile.x, this.tile.y);
  }

  update() {
    this.do_stuff();
  }

  do_stuff() {
    let n = this.tile.get_adjacent_neighbors();
    n = n.filter(t => !t.monster || t.monster.isPlayer);

    if (n.length) {
      n.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
      let new_tile = n[0];
      this.try_move(new_tile.x - this.tile.x, new_tile.y - this.tile.y);
    }
  }

  try_move(dx, dy) {
    let new_tile = this.tile.get_neighbor(dx, dy);
    if (new_tile.passable) {
      if (!new_tile.monster) {
        this.move(new_tile);
      }
      return true;
    }
  }

  move(tile) {
    if (this.tile) {
      this.tile.monster = null;
    }
    this.tile = tile;
    tile.monster = this;
  }
}

/*
########  ########  ######  ######## ####    ###    ########  ##    ##
##     ## ##       ##    ##    ##     ##    ## ##   ##     ##  ##  ##
##     ## ##       ##          ##     ##   ##   ##  ##     ##   ####
########  ######    ######     ##     ##  ##     ## ########     ##
##     ## ##             ##    ##     ##  ######### ##   ##      ##
##     ## ##       ##    ##    ##     ##  ##     ## ##    ##     ##
########  ########  ######     ##    #### ##     ## ##     ##    ##

*/

class Player extends Monster {
  constructor(tile) {
    super(tile, 0, 3); // TODO change sprite here
    this.isPlayer = true;
  }
  try_move(dx,dy) {
    if (super.try_move(dx,dy)){
      tick();
    }
  }
}

class Zombie extends Monster {
  constructor(tile) {
    super(tile, 4, 3); // TODO change sprite here
  }
}

class Skeleton extends Monster {
  constructor(tile) {
    super(tile, 5, 1); // TODO change sprite here
  }
}

class Bloater extends Monster {
  constructor(tile) {
    super(tile, 6, 2); // TODO change sprite here
  }
}

class Vampire extends Monster {
  constructor(tile) {
    super(tile, 7, 1); // TODO change sprite here
  }
}

class Ghost extends Monster {
  constructor(tile) {
    super(tile, 8, 2); // TODO change sprite here
  }
}

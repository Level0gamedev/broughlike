class Monster {
  constructor(tile, sprite, hp) {
    this.move(tile);
    this.sprite = sprite;
    this.hp = hp;

    this.max_hp = 6;
    this.teleport_counter = 1;
  }

  draw() {
    if (this.teleport_counter > 0) {
      draw_sprite(10, this.tile.x, this.tile.y);
    }else{
      draw_sprite(this.sprite, this.tile.x, this.tile.y);
      this.draw_hp();
    }
  }

  draw_hp(){ //TODO redo this with line or something?
    for (let i=0; i<this.hp; i++){
      draw_sprite(
        9,
        this.tile.x + (i%3)*(5/16),
        this.tile.y - Math.floor(i/3)*(5/16)
      );
    }
  }

  update() {
    this.teleport_counter--;
    //stunned mobs do do_stuff
    if (this.stunned || this.teleport_counter>0) {
      this.stunned = false;
      return;
    }
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
      if (!new_tile.monster) { //if you can walk there (no monb) - walk there
        this.move(new_tile);
      }else{ //if there is a mob of not your kind (player/monster) - attack!
        if(this.isPlayer != new_tile.monster.isPlayer){
          this.attacked_this_turn = true; //remember that you attacked already (dor double movement)
          new_tile.monster.stunned = true; //stun monster so they don't attack
          new_tile.monster.hit(1); //deal damage
        }
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

  hit(damage) {
    this.hp-=damage;
    if (this.hp <=0 ) {
      this.die();
    }
  }

  die() {
    this.dead = true;
    this.tile.monster = null;
    this.sprite = 1;
  }

  heal(damage) {
    this.hp = Math.min(this.max_hp, this.hp+damage);
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
    this.teleport_counter = 0;
  }
  try_move(dx,dy) {
    if (super.try_move(dx,dy)){
      tick();
    }
  }
}

class Normal extends Monster {
  constructor(tile) {
    super(tile, 4, 3); // TODO change sprite here
  }
}

class Fast extends Monster { //moves twice
  constructor(tile) {
    super(tile, 5, 1); // TODO change sprite here
  }
  do_stuff() {
    this.attacked_this_turn = false;
    super.do_stuff();

    if (!this.attacked_this_turn) {
      super.do_stuff();
    }
  }
}

class Tank extends Monster { //moves every other turn
  constructor(tile) {
    super(tile, 6, 2); // TODO change sprite here
  }
  update() {
    let started_stunned = this.stunned;
    super.update();
    if (!started_stunned) {
      this.stunned = true;
    }
  }
}

class Digger extends Monster { // destroys walls
  constructor(tile) {
    super(tile, 7, 1); // TODO change sprite here
  }
  do_stuff() {
    let n = this.tile.get_adjacent_neighbors().filter(t => !t.passable && in_bounds(t.x, t.y)); //TODO change passable to non-essential tiles
    if (n.length) {
      n[0].replace(Floor);
      this.heal(0.5);
    }else{
      super.do_stuff();
    }
  }
}

class Jester extends Monster {
  constructor(tile) {
    super(tile, 8, 2); // TODO change sprite here
  }
  do_stuff(){
    let n = this.tile.get_adjacent_passable_neighbors();
    if (n.length) {
      this.try_move(n[0].x - this.tile.x, n[0].y - this.tile.y);
    }
  }
}

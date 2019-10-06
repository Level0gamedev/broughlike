class Tile {
  constructor(x, y, sprite, passable, actionable) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.passable = passable || false;
    this.actionable = actionable || false;
  }

  draw(){
    draw_sprite(this.sprite, this.x, this.y);
  }
}

class Floor extends Tile {
  constructor(x,y) {
    super(x,y,2,true);
  }
}

class Wall extends Tile {
  constructor(x,y) {
    super(x,y,3,false);
  }
}

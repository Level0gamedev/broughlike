class Tile {
  constructor(x, y, sprite, passable, actionable) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.passable = passable || false;
    this.actionable = actionable || false;
  }

  get_neighbor(dx,dy){
    return get_tile(this.x + dx, this.y + dy);
  }
  get_adjacent_neighbors(){
    return shuffle([
      this.get_neighbor(0, -1),
      this.get_neighbor(0, 1),
      this.get_neighbor(-1, 0),
      this.get_neighbor(1, 0)
    ]);
  }
  get_adjacent_passable_neighbors(){
    return this.get_adjacent_neighbors().filter(t => t.passable);
  }
  get_connected_tiles(){
    let connected_tiles = [this];
    let frontier = [this];
    while(frontier.length){
      let neighbors = frontier.pop()
        .get_adjacent_passable_neighbors()
        .filter(t => !connected_tiles.includes(t));
      connected_tiles = connected_tiles.concat(neighbors);
      frontier = frontier.concat(neighbors);
    }
    return connected_tiles;
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

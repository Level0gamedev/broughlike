function generate_level() {
  generate_tiles();
}

function generate_tiles(){
  current_tiles = []
  for (let i = 0; i < num_tiles; i++) {
    current_tiles[i] = [];
    for (let j = 0; j < num_tiles; j++) {
      current_tiles[i][j] = new Wall(i,j);
      if (Math.random() < 0.3) {
        current_tiles[i][j] = new Wall(i,j);
      }else{
        current_tiles[i][j] = new Floor(i,j);
      }
    }
  }
}

function in_bounds(x,y){
    return x>0 && y>0 && x<num_tiles-1 && y<num_tiles-1;
}

function get_tile(x,y){
  if (in_bounds(x,y)) {
    return current_tiles[x][y];
  }else{
    return new Wall(x,y);
  }
}

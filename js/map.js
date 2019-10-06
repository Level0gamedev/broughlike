function generate_level() {
  try_to('generate the level', function(){
    return generate_tiles() == get_random_passable_tile().get_connected_tiles().length;
  });
  //generate_tiles();
}

function generate_tiles(){
  let passable_tiles = 0;
  current_tiles = []
  for (let i = 0; i < num_tiles; i++) {
    current_tiles[i] = [];
    for (let j = 0; j < num_tiles; j++) {
      current_tiles[i][j] = new Wall(i,j);
      if (Math.random() < 0.25 || !in_bounds(i,j)) {
        current_tiles[i][j] = new Wall(i,j);
      }else{
        current_tiles[i][j] = new Floor(i,j);
        passable_tiles++;
      }
    }
  }
  return passable_tiles;
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

function get_random_passable_tile(){
  let tile;
  try_to('get random passable tile', function(){
    let x = random_range(0,num_tiles-1);
    let y = random_range(0,num_tiles-1);
    tile = get_tile(x,y);
    return tile.passable && !tile.monster;
  });
  return tile;
}

function generate_level() {
  try_to('generate the level', function(){
    return generate_tiles() == get_random_passable_tile().get_connected_tiles().length;
  });
  generate_monsters();
  //make starting monsters visible from the start
  for (let i=0; i<monsters.length; i++) {
    monsters[i].teleport_counter = 0;
  }
  //generate treassure - TODO later
  for (let i=0; i<3; i++) {
    get_random_passable_tile().treasure = true;
  }
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
    return tile.passable && !tile.monster && !tile.treasure;
  });
  return tile;
}

function generate_monsters() {
  monsters = [];
  let num_monsters = level +1;
  for (let i=0; i<num_monsters; i++){
    spawn_monster();
  }
}

function spawn_monster() {
  let monster_type = shuffle([Normal, Fast, Tank, Digger, Jester])[0];
  let monster = new monster_type(get_random_passable_tile());
  monsters.push(monster);
}

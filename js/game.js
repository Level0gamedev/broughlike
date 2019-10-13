function setup_canvas() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = tile_size * (num_tiles + ui_width) *scale;
  canvas.height = tile_size * num_tiles *scale;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';

  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale,scale);
}

function draw_sprite(sprite,x,y) {
  ctx.drawImage(
    spritesheet,
    sprite*16,
    0,
    16,
    16,
    x*tile_size,
    y*tile_size,
    tile_size,
    tile_size
  );
}

function draw_game() {
  if (game_state == "dungeon" || game_state == "dead"){
    //clear screen
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //draw map
    for(let i=0;i<num_tiles;i++){
        for(let j=0;j<num_tiles;j++){
            get_tile(i,j).draw();
        }
    }
    //draw monsters
    for (let i=0; i<monsters.length;i++){
      monsters[i].draw();
    }
    //draw player
    player.draw();
    print("Level: "+level,160,4, {centered:"ui"});
    print("Score: "+score,160,16, {centered:"ui"});
  }
}

function tick() {
  //update monsters
  for (let k=monsters.length-1;k>=0;k--){
    if (!monsters[k].dead) {
      monsters[k].update();
    }else{
      monsters.splice(k,1);
    }
  }
  //check for player death
  if (player.dead) {
    game_state = "dead";
  }
  //spawn new monsters on level
  spawn_counter--;
  if (spawn_counter <=0) {
    spawn_monster();
    spawn_rate--;
    spawn_counter = spawn_rate;
    spawn_rate = Math.max(spawn_rate,2);
  }
}

function show_title() {
  ctx.fillStyle = 'rgba(0,0,0,.75)';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  game_state = "title";
  print("working", 0,39, {size:3, centered:"game"});
  print("TITLE", 0, 64, {size:6, centered:"game"});
}

function start_game() {
  level = 1;
  score = 0;
  start_level(starting_hp);
  game_state = "dungeon";
}

function start_level(_hp) {
  spawn_rate = 15;
  spawn_counter = spawn_rate;
  generate_level();
  player = new Player(get_random_passable_tile());
  player.hp = _hp;

  get_random_passable_tile().replace(Exit);
}

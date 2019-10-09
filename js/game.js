function setup_canvas() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = tile_size * (num_tiles + ui_width);
  canvas.height = tile_size * num_tiles;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';

  ctx.imageSmoothingEnabled = false;
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
  }
}

function tick() {
  for (let k=monsters.length-1;k>=0;k--){
    if (!monsters[k].dead) {
      monsters[k].update();
    }else{
      monsters.splice(k,1);
    }
  }
  if (player.dead) {
    game_state = "dead";
  }
}

function show_title() {
  ctx.fillStyle = 'rgba(0,0,0,.75)';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  game_state = "title";
}

function start_game() {
  level = 1;
  start_level(starting_hp);
  game_state = "dungeon";
}

function start_level(_hp) {
  generate_level();
  player = new Player(get_random_passable_tile());
  player.hp = _hp;
}

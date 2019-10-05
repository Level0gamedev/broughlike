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
  ctx.clearRect(0,0,canvas.width,canvas.height); //clear screen
  draw_sprite(0,x,y);
  //ctx.fillRect(x*tile_size,y*tile_size,tile_size,tile_size); //draw rect
}

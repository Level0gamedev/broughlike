function try_to(description, callback) {
  for (let timeout=1000; timeout>0; timeout--){
    if (callback()){
      return;
    }
  }
  throw "Timeout while trying to " + description;
}

function random_range(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function shuffle(arr){
  let temp, r;
  for (let i = 1; i < arr.length; i++) {
    r = random_range(0,i);
    temp = arr[i];
    arr[i] = arr[r];
    arr[r] = temp;
  }
  return arr;
}

function print(text, x, y, options = {}) {
  //establish defaults
  x = x || 0;
  y = y || 0;
  options.color = options.color || '#FFFFFF';
  options.size = options.size || 1;
  options.centered = options.centered || false;
  //adjust xy to point to top left pixel
  y=y+5*options.size;

  ctx.fillStyle = options.color;
  ctx.font = 8*options.size + "px main_font";
  if (options.centered=="game") {
    x = ((canvas.width/scale) - ctx.measureText(text).width) /2;
  }else if (options.centered=="ui") {
    x = ((ui_width*16) - ctx.measureText(text).width) /2 + 144;
  }
  ctx.fillText(text, x, y);
}

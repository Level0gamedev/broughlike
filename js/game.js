/*
 ######  ######## ######## ##     ## ########
##    ## ##          ##    ##     ## ##     ##
##       ##          ##    ##     ## ##     ##
 ######  ######      ##    ##     ## ########
      ## ##          ##    ##     ## ##
##    ## ##          ##    ##     ## ##
 ######  ########    ##     #######  ##
*/
function setup_canvas() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = tile_size * (dungeon_tiles + sidebar_tiles_w) *scale;
  canvas.height = tile_size * dungeon_tiles *scale;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';

  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale,scale);
}
/*
########  ########     ###    ##      ##
##     ## ##     ##   ## ##   ##  ##  ##
##     ## ##     ##  ##   ##  ##  ##  ##
##     ## ########  ##     ## ##  ##  ##
##     ## ##   ##   ######### ##  ##  ##
##     ## ##    ##  ##     ## ##  ##  ##
########  ##     ## ##     ##  ###  ###
*/
function draw_sprite(sprite,x,y, flipped) {
  if (flipped) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
      spritesheet,
      sprite*tile_size,
      0,
      tile_size,
      tile_size,
      -(x+1)*tile_size + shake_x,
      y*tile_size + shake_y,
      tile_size,
      tile_size,
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      spritesheet,
      sprite*16,
      0,
      tile_size,
      tile_size,
      x*tile_size + shake_x,
      y*tile_size + shake_y,
      tile_size,
      tile_size
    );
  }
}

function draw_game() {
  if (game_state == "dungeon" || game_state == "dead"){
    //clear screen
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //shake vfx
    screenshake();
    //draw map
    for(let i=0;i<dungeon_tiles;i++){
        for(let j=0;j<dungeon_tiles;j++){
            get_tile(i,j).draw();
        }
    }
    //draw monsters
    for (let i=0; i<monsters.length;i++){
      monsters[i].draw();
    }
    //draw player
    player.draw();
    queue_animations();
    print("Level: "+level,160,4, {centered:"sidebar"});
    print("Score: "+score,160,16, {centered:"sidebar"});
  }
}

function screenshake(){
  if(shake_amount){
    shake_amount--;
  }
  let shake_angle = Math.random()*Math.PI*2;
  shake_x = Math.round(Math.cos(shake_angle)*shake_amount)*2;
  shake_y = Math.round(Math.sin(shake_angle)*shake_amount)*2;

}
/*
##     ## ########  ########     ###    ######## ########
##     ## ##     ## ##     ##   ## ##      ##    ##
##     ## ##     ## ##     ##  ##   ##     ##    ##
##     ## ########  ##     ## ##     ##    ##    ######
##     ## ##        ##     ## #########    ##    ##
##     ## ##        ##     ## ##     ##    ##    ##
 #######  ##        ########  ##     ##    ##    ########
*/
function take_turn() {
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
    add_score(score, false);

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
function queue_animations() {
  ///this is messy, don't look!
  if (p_t != -1) {
    p_t += 0.125;
  }
  if (p_t > 1) {
    p_t = -1;
    player.state = "idle"
  }
  if (p_t == 0.375) {
    m_t = 0;
  }
  if (m_t != -1) {
    m_t += 0.125;
  }
  if (m_t > 1) {
    m_t = -1;
  }
}

function animate(who) {
  let _t=0;
  if (who.isPlayer) {
    _t = p_t;
  }else{
    _t = m_t;
  }

  if (_t != -1) {
    let tme = _t;
    if (who.state=="walk") {
      who.offsetX = who.offsetX*(1-_t);
      who.offsetY = who.offsetY*(1-_t);
    }
    if (who.state=="bump") {
      if (_t>0.5) {
        tme = 1-_t
      }
      who.offsetX = who.offsetX*(1-tme);
      who.offsetY = who.offsetY*(1-tme);
    }
  }
}


/*
 ######      ###    ##     ## ########     ######  ########    ###    ######## ########  ######
##    ##    ## ##   ###   ### ##          ##    ##    ##      ## ##      ##    ##       ##    ##
##         ##   ##  #### #### ##          ##          ##     ##   ##     ##    ##       ##
##   #### ##     ## ## ### ## ######       ######     ##    ##     ##    ##    ######    ######
##    ##  ######### ##     ## ##                ##    ##    #########    ##    ##             ##
##    ##  ##     ## ##     ## ##          ##    ##    ##    ##     ##    ##    ##       ##    ##
 ######   ##     ## ##     ## ########     ######     ##    ##     ##    ##    ########  ######
*/


function show_title() {
  ctx.fillStyle = 'rgba(0,0,0,.75)';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  game_state = "title";
  print("working", 0,15, {size:3, centered:"game"});
  print("TITLE", 0, 40, {size:3, centered:"game"});

  draw_scores();
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
  exit_tile.passable = true;
}
/*
 ######   ######   #######  ########  ########
##    ## ##    ## ##     ## ##     ## ##
##       ##       ##     ## ##     ## ##
 ######  ##       ##     ## ########  ######
     ##  ##       ##     ## ##   ##   ##
##    ## ##    ## ##     ## ##    ##  ##
 ######   ######   #######  ##     ## ########
*/

function get_score() {
  if(localStorage["scores"]){
      return JSON.parse(localStorage["scores"]);
  }else{
      return [];
  }
}

function add_score(score, won){
    let scores = get_score();
    let scoreObject = {score: score, run: 1, totalScore: score, active: won};
    let lastScore = scores.pop();

    if(lastScore){
        if(lastScore.active){
            scoreObject.run = lastScore.run+1;
            scoreObject.totalScore += lastScore.totalScore;
        }else{
            scores.push(lastScore);
        }
    }
    scores.push(scoreObject);
    localStorage["scores"] = JSON.stringify(scores);
}

function draw_scores() {
  let scores = get_score();
  let _y = 65;
  if (scores.length) {
    print(
      right_pad(["RUN","SCORE","TOTAL"]),
      0,_y,
      {centered:"game"}
    );

    let newestScore = scores.pop();
    scores.sort(function(a,b) {
      return b.totalScore - a.totalScore;
    });

    scores.unshift(newestScore);

    for(let i=0;i<Math.min(8,scores.length);i++){
      let scoreText = right_pad([scores[i].run, scores[i].score, scores[i].totalScore]);
      print(scoreText, 0,_y+8*i+8,{centered:"game"});
    }
  }
}

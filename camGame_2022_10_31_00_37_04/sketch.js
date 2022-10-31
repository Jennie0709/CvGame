let myFont;
let soundStart;
let soundOver;
let imgHuman;
let imgMoon;

let bullets = [];
let enemies = [];
let score = 0;

let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;

function preload(){
  imgHuman = loadImage('images/Human copy.png');
  imgMoon = loadImage('images/Ground.png');
  imgGun = loadImage('images/Gun.png');

  soundFormats('mp3', 'ogg');
  soundStart = loadSound('images/Game_Start copy.mp3');
  soundOver = loadSound('images/Game_over copy.mp3');
}
 
function setup() {
  soundStart.play();
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  
  // Spawn enemies
  for (let i = 0; i < 10; i++){
    let enemy = {
      x: random(0, width),
      y: random(-800, 0)
    }
    enemies.push(enemy)
  }
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let eX = poses[0].pose.keypoints[1].position.x;
    let eY = poses[0].pose.keypoints[1].position.y;
    noseX = lerp(noseX, nX, 0.5);
    noseY = lerp(noseY, nY, 0.5);
    eyelX = lerp(eyelX, eX, 0.5);
    eyelY = lerp(eyelY, eY, 0.5);
  }
}

function modelReady() {
  console.log('model ready');
}

function draw() {
  image(video, 0, 0);
  image(imgMoon, -130, 400, 1000);
  
  let d = dist(noseX, noseY, eyelX, eyelY);

  fill(255, 0, 0);
  image(imgGun, noseX, noseY, 70);
  
  for (let bullet of bullets){
      bullet.y -= 5 // Bullet Speed
      fill('rgb(0,255,0)');
      ellipse(bullet.x, bullet.y, 10) // Bullet Design
    }
  
  // Enemy
    for (let enemy of enemies){
      enemy.y += 1
      fill(random(360), random(100), random(100));
      text('👾', enemy.x, enemy.y) // Enemy Design
      fill(255);
      if (enemy.y > height){
        text("You couldn't protect the moon...🌕", windowWidth/2, windowHeight/2)
        noLoop()
        soundStart.stop();
        soundOver.play();
      }
    }
  
  // Collisons
    for (let enemy of enemies){
      for (let bullet of bullets){
        if(dist(enemy.x, enemy.y, bullet.x, bullet.y) < 10){
          enemies.splice(enemies.indexOf(enemy), 1) // Get rid of 1 enemy
          bullets.splice(bullets.indexOf(bullet), 1) // Get rid of 1 bullet
          
          for (let i = 0; i < 10; i++){
          let newEnemy = {
              x: random(0, width),
              y: random(-800, 0)
            }
          enemies.push(newEnemy);
          score += 1
          }
        }
      }
    } 
  
  // Score
    textSize(windowWidth * 0.02); 
    fill(255);
    text(score, 40, 60) 
  
}

function keyPressed(space){
  let bullet = {
    x: noseX, 
    y: noseY
  }
  bullets.push(bullet)
}
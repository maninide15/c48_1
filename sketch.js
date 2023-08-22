var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieGroup, zombieImg
var bullet, bulletImg, bulletGroup

var bullets = 50
var score = 0
var lives = 3

var heart1Img, heart2Img, heart3Img
var heart1, heart2, heart3 

var gameState = "play"

var treasureImg, treasureGroup, treasure

var winSound, loseSound, explosionSound






function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")
  zombieImg = loadImage("assets/zombie.png")
  bulletImg = loadImage("assets/bullet.png")

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  treasureImg = loadImage("assets/treasure.png")

  winSound = loadSound("assets/win.mp3")
  loseSound = loadSound("assets/lose.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

  winsSound.looping = false
  loseSound.looping = false
  explosionSound.looping = false




}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)


heart1 = createSprite(displayWidth-150, 40, 20, 20)
heart1.addImage(heart1Img)
heart1.scale = 0.5
heart1.visible = false;

heart2 = createSprite(displayWidth-150, 40, 20, 20)
heart2.addImage(heart2Img)
heart2.scale = 0.5
heart2.visible = false;

heart3 = createSprite(displayWidth-170, 40, 20, 20)
heart3.addImage(heart3Img)
heart3.scale = 0.5
heart3.visible = true;



  zombieGroup = new Group()
  bulletGroup = new Group()
  treasureGroup = new Group()


}

function draw() {
  background(0); 

  if (gameState === "play"){

  
    spawnZombie()
    spawnTreasure()
    


    if(lives === 3){
      heart3.visible = true
      heart2.visible = false
      heart1.visible = false
    }

    if(lives === 2){
      heart3.visible = false
      heart2.visible = true
      heart1.visible = false

    }

    if(lives === 1){
      heart3.visible = false
      heart2.visible = false
      heart1.visible = true

    }

}


  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}

if(lives === 0 ){
  gameState = "end"
  loseSound.play()
  
}

if(score === 100){
  gameState = "won"
  winSound.play()
  
  
}





//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
 
  player.addImage(shooter_shooting)
  bullet = createSprite(displayWidth - 1150, player.y-30, 20, 10)
  bullet.addImage(bulletImg)
  bullet.velocityX = 20
  bulletGroup.add(bullet)
  bullet.scale = 0.08
  bullet.depth = player.depth
  player.depth +=1

  if(bullets > 0) {
    bullets-=1
  }

  explosionSound.play()
  
  
 
}

if(bullets === 0){
  gameState = "no_bullets"
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)

}

if(zombieGroup.isTouching(bulletGroup)){
  for(i =0; i < zombieGroup.length; i++){
    if(zombieGroup[i].isTouching(bulletGroup)){
      zombieGroup[i].destroy()
      bulletGroup.destroyEach()
      score += 2
      explosionSound.play()
      
    }
  }
}

if(zombieGroup.isTouching(player)){
  for( i = 0; i< zombieGroup.length ; i++){
    if(zombieGroup.isTouching(player)){
      zombieGroup.destroyEach()
      lives -= 1
      console.log(lives)
      loseSound.play()

    }
  }
}

if(treasureGroup.isTouching(player)){
  for( i = 0; i< treasureGroup.length ; i++){
    if(treasureGroup.isTouching(player)){
      treasureGroup.destroyEach()
      score +=10
      
    }
  }
}

// if(treasureGroup.isTouching(player)){
//   for( i = 0; i<treasureGroup.length; i++){
//     if(treasureGroup.isTouching(player)){
//       treasureGroup.destroyEach()
//       score += 10

//     }

//   }
// }





drawSprites();

textSize(29)
fill("white")
text("Score : " + score, displayWidth - 180, 120)
text("Lives : " + lives, displayWidth - 180, 150)
text("Bullets : " + bullets, displayWidth - 180, 180)

if(gameState === "won"){
  fill("green")
  textSize(100)
  textStyle(BOLD)
  text("YOU WON!", windowWidth/2 - 250, windowHeight/2);
  zombieGroup.destroyEach()
  player.destroy() 
  treasureGroup.destroyEach()
  
  
}

else if(gameState === "end"){
  fill("red")
  textSize(100)
  textStyle(BOLD)
  text("YOU LOST :(", windowWidth/2 - 250, windowHeight/2);
  zombieGroup.destroyEach();
  player.destroy()
  treasureGroup.destroyEach()
  
  
}

else if(gameState === "no_bullets"){
  fill("red")
  textSize(100)
  textStyle(BOLD)
  text("YOU RAN OUT OF BULLETS :(", windowWidth/2 - 720, windowHeight/2);
  zombieGroup.destroyEach();
  player.destroy()
  bulletGroup.destroyEach()
  treasureGroup.destroyEach()
  
}



}

function spawnZombie(){
  if(frameCount %60 === 0){
    zombie = createSprite(random(1000, 1500), random(100, 500), 40, 40)
    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombieGroup.add(zombie)
    zombie.lifetime = 500

  }
}


function spawnTreasure(){
  if(frameCount%150 === 0){
    treasure = createSprite(random(1000, 1500), random(100, 500), 40, 40)
    treasure.addImage(treasureImg)
    treasure.scale = 0.2
    treasure.velocityX = -2
    treasureGroup.add(treasure)
    treasure.lifetime = 500
  }
}



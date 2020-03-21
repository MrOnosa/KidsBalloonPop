window.onload = function () {
    // add eventListener
    document.addEventListener(
      "keydown", function(key){
        //If left or right arrow key...
        if (event.keyCode === 37 || event.keyCode === 39) {
          sway(event.keyCode === 37);
        }
      }, false
    );

    // add eventListener for tizen specific events
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
			try {
			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
  });   
  
  document.addEventListener("rotarydetent", function(ev)
  {
    var direction = ev.detail.direction;
    sway(direction == "CCW"); //Turned counter-clockwise
  });
};

//static constants
var canvas = {width: 360, height: 360};
if(window.innerWidth > canvas.width){
  canvas.width = window.innerWidth;
}
if(window.innerHeight > canvas.height){
  canvas.height = window.innerHeight;
}
var totalBalloons = Math.floor((canvas.width * canvas.height) / 69120);
if(totalBalloons < 6){
  totalBalloons = 6;
}
var balloons = [];
var birds = [];
var thomases = [];
var balloonImages = [
  "./images/frame_0_delay-0.1s.png",
  "./images/frame_1_delay-0.1s.png",
  "./images/frame_2_delay-0.1s.png",
  "./images/frame_3_delay-0.1s.png",
  "./images/frame_4_delay-0.1s.png",
  "./images/frame_5_delay-0.1s.png",
  "./images/frame_6_delay-0.1s.png"];
var birdImages = [
    "./images/birds1.png",
    "./images/birds2.png"];  
var thomasImages = [
    "./images/thomas1.png",
    "./images/thomas2.png"];
var far;
var backgroundUrl = "./images/bluebackground.png";
var balloonTextureArray = [];
var balloonHeight = 141;
var balloonWidth = 123;
var balloonCenter = {x: 112/2, y: 122/2};
var balloonFrame = new PIXI.Rectangle(84, 62, balloonWidth, balloonHeight);
var balloonHitArea = new PIXI.Ellipse(balloonFrame.x + balloonCenter.x, balloonFrame.y + balloonCenter.y, balloonCenter.x, balloonCenter.y);

var birdTextureArray = [];
var thomasTextureArray = [];

//static variables
var wind = 0;

var app = new PIXI.Application(canvas.width, canvas.height, {backgroundColor : 0xF0F0F0, forceCanvas: true});
document.body.appendChild(app.view);
PIXI.loader.add([{url: balloonImages[0]},
                 {url: balloonImages[1]},
                 {url: balloonImages[2]},
                 {url: balloonImages[3]},
                 {url: balloonImages[4]},
                 {url: balloonImages[5]},
                 {url: balloonImages[6]},
                {url: backgroundUrl},
              {url: birdImages[0]},
              {url: birdImages[1]},
              {url: thomasImages[0]},
              {url: thomasImages[1]},
            ])
      .load(setup);

function setup() {
  var circle = new PIXI.Graphics();
  circle.lineStyle(4, 0xFF3300, 1);
  circle.beginFill(0xFFFFFF);
  circle.drawCircle(180, 180, 183);
  circle.endFill();
  //app.stage.addChild(circle);
  
  var farTexture = PIXI.Texture.fromImage(backgroundUrl);
  far = new PIXI.TilingSprite(farTexture,250,250);
  far.width = canvas.width;
  far.height = canvas.height;
  far.position.x = 0;
  far.position.y = 0;
  app.stage.addChild(far);

  for (var i=0; i < balloonImages.length; i++)
  {
       var texture = PIXI.Texture.fromImage(balloonImages[i]);
       balloonTextureArray.push(texture);
  }

  for (var i=0; i < birdImages.length; i++)
  {
       var texture = PIXI.Texture.fromImage(birdImages[i]);
       birdTextureArray.push(texture);
  }

  for (var i=0; i < thomasImages.length; i++)
  {
       var texture = PIXI.Texture.fromImage(thomasImages[i]);
       thomasTextureArray.push(texture);
  }

  for(i = 0; i < totalBalloons; i++)
  {
    var balloon = window.balloon();
    balloons.push(balloon);
    app.stage.addChild(balloon.sprite);
  }

  //Start the game loop
  app.ticker.add(play);
}

function sway(left){
  wind = Math.max(Math.min(wind + (left ? -0.3 : 0.3), 1), -1);
  balloons.forEach(function(balloon){
    balloon.sprite.vx = wind/2 + Math.random() * wind;
  });
}

function play(delta) {
  far.tilePosition.y -= delta * 0.128;
  far.tilePosition.x -= delta * wind;
  balloons.forEach(function(balloon){
    balloon.sprite.x += delta * balloon.sprite.vx;
    balloon.sprite.y += delta * balloon.sprite.vy;

    if(balloon.sprite.y + balloonFrame.y < -balloonHeight &&
      //If the balloon is in the middle of the popping animation, wait for it.
       balloon.popped === false 
      ) {
      balloon.sprite.visible = true;
      balloon.sprite.interactive = true;
      balloon.sprite.y = canvas.height + 5;
      balloon.sprite.x = Math.random()*canvas.width - (balloonFrame.x + balloonWidth/2); 
    }
  }); 

  for(var i = 0; i < birds.length; i++){
    var bird = birds[i];
    bird.sprite.x += delta * bird.sprite.vx;
    bird.sprite.y += delta * bird.sprite.vy;
    if(bird.sprite.y < -bird.sprite.height){
      app.stage.removeChild(bird);
      birds.splice(i, 1);
      i--;
    }
  }

  for(var i = 0; i < thomases.length; i++){
    var thomas = thomases[i];
    thomas.sprite.x += delta * thomas.sprite.vx;
    thomas.sprite.y += delta * thomas.sprite.vy;
    if(thomas.sprite.y < -thomas.sprite.height){
      app.stage.removeChild(thomas);
      thomases.splice(i, 1);
      i--;
    }
  }
}

function balloon() {    
  function onClick (e) {
    if(that.popped === false)
    {
      that.sprite.vy = -0.5;
      that.popped = true;
      that.sprite.interactive = false;
      sprite.gotoAndPlay(1);

      if(Math.random() < (1/6))
      {
        var bird = window.bird(that.sprite);
        birds.push(bird)
        var index = app.stage.getChildIndex(sprite);
        app.stage.addChildAt(bird.sprite, index);
      }

      if(Math.random() < (1/8))
      {
        var thomas = window.thomas(that.sprite);
        thomases.push(thomas)
        var index = app.stage.getChildIndex(sprite);
        app.stage.addChildAt(thomas.sprite, index);
      }
    }
  }

  function resetBalloon () {
    that.sprite.visible = false;
    that.sprite.vy = -1.5;
    that.sprite.y -= Math.random()*(canvas.height/2) + (canvas.height/2); 
    that.popped = false;
    that.sprite.gotoAndStop(0);
  }

  var sprite = new PIXI.extras.AnimatedSprite(balloonTextureArray);
  sprite.x = Math.random() * canvas.width - (balloonFrame.x + balloonWidth/2); 
  sprite.y = Math.random() * (canvas.height + 5); 
  var wind = Math.random() * 0.3 - 0.15;
  sprite.vx = wind/2 + Math.random() * wind;
  sprite.vy = -1.5;
  sprite.interactive = true;
  sprite.on('pointerdown', onClick);
  sprite.hitArea = balloonHitArea;
  sprite.animationSpeed = Math.random() * 0.1 + 0.25;
  sprite.gotoAndStop(0);
  sprite.onLoop = resetBalloon;
  
  var that = {
    sprite: sprite,
    popped: false
  };  
  return that;
}

function thomas(referenceSprite) {    
  var sprite = new PIXI.extras.AnimatedSprite(thomasTextureArray);
  sprite.anchor.y = 0.5;
  sprite.anchor.x = 0.5;
  sprite.x =  referenceSprite.x + referenceSprite.width/2; 
  sprite.y =  referenceSprite.y + referenceSprite.height/2; 
  sprite.vx = Math.random() * 4 - 2;
  if(sprite.vx < 0) {
    sprite.scale.x = -1;
  }
  sprite.vy = -3.5;
  sprite.interactive = false;
  sprite.play();
  sprite.animationSpeed = 0.18;
  
  var that = {
    sprite: sprite
  };  
  return that;
}

function bird(referenceSprite) {  
  var sprite = new PIXI.extras.AnimatedSprite(birdTextureArray);
  sprite.anchor.y = 0.5;
  sprite.anchor.x = 0.5;
  sprite.x =  referenceSprite.x + referenceSprite.width/2; 
  sprite.y =  referenceSprite.y + referenceSprite.height/2; 
  sprite.vx = (Math.random() > 0.5 ? -1 : 1) * 3;
  if(sprite.vx < 0) {
    sprite.scale.x = -1;
  }
  sprite.vy = -4;
  sprite.interactive = false;
  sprite.play();
  sprite.animationSpeed = 0.18;
  
  var that = {
    sprite: sprite
  };  
  return that;
}
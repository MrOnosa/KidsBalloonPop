
window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back") {
			try {
			    tizen.application.getCurrentApplication().exit();
			} catch (ignore) {
			}
		}
	});    
};

var app = new PIXI.Application(360, 360, {backgroundColor : 0xF0F0F0, forceCanvas: true});
document.body.appendChild(app.view);
PIXI.loader.add([{url: "./images/frame_0_delay-0.1s.png"},
                 {url: "./images/frame_1_delay-0.1s.png"},
                 {url: "./images/frame_2_delay-0.1s.png"},
                 {url: "./images/frame_3_delay-0.1s.png"},
                 {url: "./images/frame_4_delay-0.1s.png"},
                 {url: "./images/frame_5_delay-0.1s.png"},
                 {url: "./images/frame_6_delay-0.1s.png"}])
      .load(setup);

//Define any variables that are used in more than one function
var balloons = [];
var balloonImages = [
  "./images/frame_0_delay-0.1s.png",
  "./images/frame_1_delay-0.1s.png",
  "./images/frame_2_delay-0.1s.png",
  "./images/frame_3_delay-0.1s.png",
  "./images/frame_4_delay-0.1s.png",
  "./images/frame_5_delay-0.1s.png",
  "./images/frame_6_delay-0.1s.png"];
var textureArray = [];
var balloonHeight = 141;
var balloonWidth = 123;
var balloonFrame = new PIXI.Rectangle(84, 62, balloonWidth, balloonHeight);

function setup() {
  var circle = new PIXI.Graphics();
  circle.lineStyle(4, 0xFF3300, 1);
  circle.beginFill(0xFFFFFF);
  circle.drawCircle(180, 180, 183);
  circle.endFill();
  //app.stage.addChild(circle);

  for (var i=0; i < balloonImages.length; i++)
  {
       texture = PIXI.Texture.fromImage(balloonImages[i]);
       textureArray.push(texture);
  };

  for(i = 0; i < 6; i++)
  {
    var balloon = window.balloon();
    balloons.push(balloon);
  }

  balloons.forEach(function(drawable){
    app.stage.addChild(drawable.sprite);
  });

  //Start the game loop
  app.ticker.add(play);
}

function play(delta) {
  balloons.forEach(function(balloon){
    balloon.sprite.x += delta * balloon.sprite.vx;
    balloon.sprite.y += delta * balloon.sprite.vy;

    if(balloon.sprite.y + balloonFrame.y < -balloonHeight &&
      //If the balloon is in the middle of the popping animation, wait for it to
       balloon.popped === false 
      ) {
      balloon.sprite.visible = true;
      balloon.sprite.interactive = true;
      balloon.sprite.y = 365;
      balloon.sprite.x = Math.random()*360 - (balloonFrame.x + balloonWidth/2); 
    }
  }); 
}

function balloon() {    
  function onClick (e) {
    //console.log(e.data.global);
    //TODO: Check if click on ellipse
    if(that.popped === false)
    {
      that.sprite.vy = -0.5;
      that.popped = true;
      that.sprite.interactive = false;
      sprite.gotoAndPlay(1);
    }
  }

  function resetBalloon () {
    that.sprite.visible = false;
    that.sprite.vy = -1.5;
    that.sprite.y -= Math.random()*180 + 180; 
    that.popped = false;
    that.sprite.gotoAndStop(0);
  }

  var sprite = new PIXI.extras.AnimatedSprite(textureArray);
  sprite.x = Math.random()*360 - (balloonFrame.x + balloonWidth/2); 
  sprite.y = Math.random()*365; 
  sprite.vx = 0;
  sprite.vy = -1.5;
  sprite.interactive = true;
  sprite.on('pointerdown', onClick);
  sprite.hitArea = balloonFrame;
  sprite.animationSpeed = 0.3;
  sprite.gotoAndStop(0);
  sprite.onLoop = resetBalloon;
  
  var that = {
    sprite: sprite,
    popped: false,
    timeSincePopped: 0
  };  
  return that;
}
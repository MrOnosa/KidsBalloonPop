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
var canvas = {width: 1920, height: 1080};
var totalBalloons = 30;
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
var balloonCenter = {x: 112/2, y: 122/2};
var balloonFrame = new PIXI.Rectangle(84, 62, balloonWidth, balloonHeight);
var balloonHitArea = new PIXI.Ellipse(balloonFrame.x + balloonCenter.x, balloonFrame.y + balloonCenter.y, balloonCenter.x, balloonCenter.y);

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
                 {url: balloonImages[6]}])
      .load(setup);

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
}

function balloon() {    
  function onClick (e) {
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
    that.sprite.y -= Math.random()*(canvas.height/2) + (canvas.height/2); 
    that.popped = false;
    that.sprite.gotoAndStop(0);
  }

  var sprite = new PIXI.extras.AnimatedSprite(textureArray);
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
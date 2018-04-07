
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
  for(i = 0; i < 4; i++)
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

    if(balloon.sprite.y < -balloonHeight) {
      balloon.sprite.visible = true;
      balloon.sprite.interactive = true;
      balloon.sprite.y =  365;
      balloon.sprite.x =  Math.random()*360 - (balloonWidth/2); 
      if(balloon.popped){
        balloon.timeSincePopped = 999999;
      }
    }

    if(balloon.popped) {
      balloon.timeSincePopped += delta * 20;
      var frame = Math.floor( balloon.timeSincePopped / 100);
      if(frame > 6)
      { 
        balloon.resetBalloon();
      } else {
        balloon.sprite.texture = PIXI.TextureCache["./images/frame_"+frame+"_delay-0.1s.png"];
      }
    }
  }); 
}

function balloon() {    
  function onClick () {
    if(that.popped === false)
    {
      that.sprite.vy = -0.5;
      that.popped = true;
      that.timeSincePopped = 100;//Will be modding by 100 to get keyframe
      that.sprite.x -= 84;
      that.sprite.y -= 62;
      that.sprite.interactive = false;
    }
  }

  function resetBalloon () {
    that.sprite.visible = false;
    that.sprite.vy = -1.5;
    that.sprite.y -= Math.random()*180 + 180; 
    that.popped = false;
    that.timeSincePopped = 0;
    that.sprite.texture = PIXI.TextureCache["./images/frame_0_delay-0.1s.png"];
    that.sprite.texture.frame = balloonFrame;
  }

  var texture = PIXI.TextureCache["./images/frame_0_delay-0.1s.png"];
  texture.frame = balloonFrame;
  var sprite = new PIXI.Sprite(texture);
  sprite.x = Math.random()*360 - (balloonWidth/2); 
  sprite.y = Math.random()*365; 
  sprite.vx = 0;
  sprite.vy = -1.5;
  sprite.interactive = true;
  sprite.on('pointerdown', onClick);
  
  var that = {
    sprite: sprite,
    popped: false,
    timeSincePopped: 0,
    resetBalloon: resetBalloon
  };  
  return that;
}
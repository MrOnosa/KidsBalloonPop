
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
PIXI.loader.add([{url: "./images/frame_0_delay-0.1s.png"}])
      .load(setup);


//Define any variables that are used in more than one function
var  drawables = [];
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
      
  var texture = PIXI.TextureCache["./images/frame_0_delay-0.1s.png"];
  texture.frame = balloonFrame;
  for(i = 0; i < 4; i++)
  {
    var sprite = new PIXI.Sprite(texture);
    sprite.x = Math.random()*360 - (balloonWidth/2); 
    sprite.y = Math.random()*365; 
    sprite.vx = 0;
    sprite.vy = -1;
    sprite.interactive = true;
    sprite.on('pointerdown', onClick);
    drawables.push(sprite);
  }

  drawables.forEach(function(drawable){
    app.stage.addChild(drawable);
  });

  //Start the game loop
  app.ticker.add(play);
}

function onClick (s) {
  s.currentTarget.visible = false;
  //s.currentTarget.vy = 0;
  s.currentTarget.y = Math.random()*180 ; 
  var i = drawables.indexOf(s.currentTarget);
}

function play(delta) {
  drawables.forEach(function(drawable){
    drawable.x += delta * drawable.vx;
    drawable.y += delta * drawable.vy;

    if(drawable.y < -balloonHeight)
    {
      drawable.visible = true;
      drawable.y =  365;
      drawable.x =  Math.random()*360 - (balloonWidth/2); 
    }
  });
 
}
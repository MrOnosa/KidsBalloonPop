
window.onload = function () {
    // TODO:: Do your initialization job

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

//Aliases
var Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
canvasRenderer = PIXI.CanvasRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite;

var stage = new Container(),
renderer = new canvasRenderer(1360,1360);
renderer.backgroundColor = 0xFFFFFF;
document.body.appendChild(renderer.view);
loader
.add([{url: "./images/frame_0_delay-0.1s.png"}])
.load(setup);


//Define any variables that are used in more than one function
var state, drawables;
var balloonHeight = 141;
var balloonWidth = 123;
var balloonFrame = new PIXI.Rectangle(84, 62, balloonWidth, balloonHeight);
drawables = [];
function setup() {
  var circle = new PIXI.Graphics();
  circle.lineStyle(4, 0xFF3300, 1);
  circle.beginFill(0xF0F0F0);
  circle.drawCircle(180, 180, 183);
  circle.endFill();
  stage.addChild(circle);
      
  var texture = PIXI.TextureCache["./images/frame_0_delay-0.1s.png"];
  texture.frame = balloonFrame;
  for(i = 0; i < 4; i++)
  {
    var sprite = new Sprite(texture);
    sprite.x = Math.random()*360 - (balloonWidth/2); 
    sprite.y = Math.random()*365; 
    sprite.vx = 0;
    sprite.vy = -1;
    sprite.interactive = true;
    sprite.on('pointerdown', onClick);
    drawables.push(sprite);
  }

  drawables.forEach(function(drawable){
    stage.addChild(drawable);
  });

  //Set the game state
  state = play;

  //Start the game loop
  gameLoop();
}

function onClick (s) {
  s.currentTarget.visible = false;
  //s.currentTarget.vy = 0;
  s.currentTarget.y = Math.random()*180 ; 
  var i = drawables.indexOf(s.currentTarget);
}

function gameLoop(){

  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);

  //Update the current game state:
  state();

  //Render the stage
  renderer.render(stage);
}

function play() {
  drawables.forEach(function(drawable){
    drawable.x += drawable.vx;
    drawable.y += drawable.vy;

    if(drawable.y < -balloonHeight)
    {
      drawable.visible = true;
      drawable.y =  365;
      drawable.x =  Math.random()*360 - (balloonWidth/2); 
    }
  });
 
}
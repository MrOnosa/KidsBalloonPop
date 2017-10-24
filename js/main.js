
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
drawables = [];
function setup() {
  var circle = new PIXI.Graphics();
  circle.lineStyle(4, 0xFF3300, 1);
  circle.beginFill(0xF0F0F0);
  circle.drawCircle(180, 180, 183);
  circle.endFill();
  stage.addChild(circle);
    
  
  //Create the `cat` sprite 
  var texture = PIXI.TextureCache["./images/frame_0_delay-0.1s.png"];
  texture.frame = new PIXI.Rectangle(84, 62, 123, 141);
  for(i = 0; i < 4; i++)
  {
    var sprite = new Sprite(texture);
    sprite.x = Math.random()*360; 
    sprite.y =Math.random()*360; 
    sprite.vx = 0;
    sprite.vy = 0;
    sprite.interactive = true;
    sprite.on('pointerdown', onClick);
  // stage.addChild(cat);
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
  var i = drawables.indexOf(s.currentTarget);
  if(i != -1) {
    drawables.splice(i, 1);
  }
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

  //Move the cat 1 pixel to the right each frame
  //cat.x += cat.vx;
  //cat.y += cat.vy;
  
}
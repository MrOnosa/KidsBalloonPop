
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
renderer = new canvasRenderer(360,360);
document.body.appendChild(renderer.view);
loader
.add([{url: "./images/cat.png"}])
.load(setup);


var keyObject = keyboard(asciiKeyCodeNumber);
keyObject.press = function() {
  //key object pressed
};
keyObject.release = function() {
  //key object released
};

//Define any variables that are used in more than one function
var cat, state;
function setup() {

  //Create the `cat` sprite 
  cat = new Sprite(resources["./images/cat.png"].texture);
  cat.y = 96; 
  cat.vx = 0;
  cat.vy = 0;
  stage.addChild(cat);

  //Capture the keyboard arrow keys
  var left = keyboard(37),
  up = keyboard(38),
  right = keyboard(39),
  down = keyboard(40);

//Left arrow key `press` method
left.press = function() {

//Change the cat's velocity when the key is pressed
cat.vx = -5;
cat.vy = 0;
};

//Left arrow key `release` method
left.release = function() {

//If the left arrow has been released, and the right arrow isn't down,
//and the cat isn't moving vertically:
//Stop the cat
if (!right.isDown && cat.vy === 0) {
  cat.vx = 0;
}
};

//Up
up.press = function() {
cat.vy = -5;
cat.vx = 0;
};
up.release = function() {
if (!down.isDown && cat.vx === 0) {
  cat.vy = 0;
}
};

//Right
right.press = function() {
cat.vx = 5;
cat.vy = 0;
};
right.release = function() {
if (!left.isDown && cat.vy === 0) {
  cat.vx = 0;
}
};

//Down
down.press = function() {
cat.vy = 5;
cat.vx = 0;
};
down.release = function() {
if (!up.isDown && cat.vx === 0) {
  cat.vy = 0;
}
};

  //Set the game state
  state = play;

  //Start the game loop
  gameLoop();
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
  cat.x += cat.vx;
  cat.y += cat.vy;
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
/*
var renderer = new PIXI.CanvasRenderer(360,360);
//var renderer = new PIXI.WebGLRenderer(256, 256);

document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
sprite = null;

PIXI.loader.add([{
	name: "test",
	url: "./images/cat.png",
  crossOrigin: ''
}]).load(function() {

	console.log("LOADED!");
  sprite = new PIXI.Sprite(PIXI.loader.resources.test.texture);
  
  sprite.scale.x = 0.4;
  sprite.scale.y = 0.4;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.x = 360/2;
  sprite.y = 360/2;
 
  stage.addChild(sprite);
  
});

//-------------

function loop() {

  requestAnimationFrame(loop);
  
  if(sprite) sprite.rotation += 0.01;
  renderer.render(stage);
}

loop();
*/
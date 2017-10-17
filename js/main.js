
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
.add([{name: "cat",url: "./images/cat.png", crossOrigin: ''}])
.load(setup);

function setup() {
	
		//Create the `cat` sprite, add it to the stage, and render it
		var cat = new Sprite(resources.cat.texture);  
		stage.addChild(cat);
		renderer.render(stage);
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
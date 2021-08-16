/*
 * PIXI.JS GAME
 */

PIXI.settings.SORTABLE_CHILDREN = true;

// static constants
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
  "./images/frame_6_delay-0.1s.png"
];
var birdImages = [
  "./images/birds1.png",
  "./images/birds2.png"
];
var thomasImages = [
  "./images/thomas1.png",
  "./images/thomas2.png"
];
var far, scoreboard;
var backgroundUrl = "./images/bluebackground.png";
var balloonTextureArray = [];
var balloonHeight = 141;
var balloonWidth = 123;
var balloonCenter = { x: 112 / 2, y: 122 / 2 };
var balloonFrame = new PIXI.Rectangle(84, 62, balloonWidth, balloonHeight);
var balloonHitArea = new PIXI.Ellipse(balloonFrame.x + balloonCenter.x, balloonFrame.y + balloonCenter.y, balloonCenter.x, balloonCenter.y);

var birdTextureArray = [];
var thomasTextureArray = [];

// global variables
var wind = 0;
var score = 0;

var app = new PIXI.Application({ resizeTo: window, backgroundColor: 0xF0F0F0 });
document.body.appendChild(app.view);

PIXI.Loader.shared
  .add(balloonImages)
  .add(backgroundUrl)
  .add(birdImages)
  .add(thomasImages)
  .load(setup);

function resizeElements() {
  far.width = app.screen.width;
  far.height = app.screen.height;
  scoreboard.position.set(app.screen.width - 10, app.screen.height - 10);
}

function setup() {
  // var circle = new PIXI.Graphics();
  // circle.lineStyle(4, 0xFF3300, 1);
  // circle.beginFill(0xFFFFFF);
  // circle.drawCircle(180, 180, 183);
  // circle.endFill();
  // app.stage.addChild(circle);

  let farTexture = PIXI.Texture.from(backgroundUrl);
  far = new PIXI.TilingSprite(farTexture, 250, 250);
  far.position.x = 0;
  far.position.y = 0;
  app.stage.addChild(far);

  for (let i = 0; i < balloonImages.length; i++) {
    let texture = PIXI.Texture.from(balloonImages[i]);
    balloonTextureArray.push(texture);
  }

  for (let i = 0; i < birdImages.length; i++) {
    let texture = PIXI.Texture.from(birdImages[i]);
    birdTextureArray.push(texture);
  }

  for (let i = 0; i < thomasImages.length; i++) {
    let texture = PIXI.Texture.from(thomasImages[i]);
    thomasTextureArray.push(texture);
  }

  let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: "white",
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 2,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 3,
  });
  scoreboard = new PIXI.Text("", style);
  scoreboard.zIndex = 2;
  scoreboard.anchor.x = 1;
  scoreboard.anchor.y = 1;
  setScore();
  app.stage.addChild(scoreboard);

  // Note: this is not updated on resize, maybe implement that someday?
  let totalBalloons = Math.floor((app.screen.width * app.screen.height) / 69120);
  if (totalBalloons < 6) {
    totalBalloons = 6;
  }

  // Now add the balloons
  for (let i = 0; i < totalBalloons; i++) {
    let balloon = window.balloon();
    balloons.push(balloon);
    app.stage.addChild(balloon.sprite);
  }

  // Call the resize util (everything related to the size of the screen)
  app.renderer.on('resize', resizeElements);
  resizeElements();

  // Start the game loop
  app.ticker.add(play);
}

function setScore() {
  scoreboard.text = score.toString();
}

function sway(left) {
  wind = Math.max(Math.min(wind + (left ? -0.3 : 0.3), 1), -1);
  balloons.forEach(function (balloon) {
    balloon.sprite.vx = wind / 2 + Math.random() * wind;
  });
}

function play(delta) {
  far.tilePosition.y -= (1 + delta) * 0.128;
  far.tilePosition.x -= (1 + delta) * wind;
  balloons.forEach(function (balloon) {
    let sprite = balloon.sprite;
    sprite.x += (1 + delta) * sprite.vx;
    sprite.y += (1 + delta) * sprite.vy;

    if (sprite.y + balloonFrame.y < -balloonHeight &&
      //If the balloon is in the middle of the popping animation, wait for it.
      balloon.popped === false
    ) {
      sprite.visible = true;
      sprite.interactive = true;
      sprite.y = app.screen.height + 5;
      sprite.x = Math.random() * app.screen.width - (balloonFrame.x + balloonWidth / 2);
      // We only update the rotation off-screen
      sprite.rotation = Math.atan(-sprite.vx / sprite.vy);
    }
  });

  for (var i = 0; i < birds.length; i++) {
    var bird = birds[i];
    bird.sprite.x += (1 + delta) * bird.sprite.vx;
    bird.sprite.y += (1 + delta) * bird.sprite.vy;
    if (bird.sprite.y < -bird.sprite.height) {
      app.stage.removeChild(bird);
      birds.splice(i, 1);
      i--;
    }
  }

  for (var i = 0; i < thomases.length; i++) {
    var thomas = thomases[i];
    thomas.sprite.x += (1 + delta) * thomas.sprite.vx;
    thomas.sprite.y += (1 + delta) * thomas.sprite.vy;
    if (thomas.sprite.y < -thomas.sprite.height) {
      app.stage.removeChild(thomas);
      thomases.splice(i, 1);
      i--;
    }
  }
}

function balloon() {
  function onClick(e) {
    if (that.popped === false) {
      that.sprite.vy = -0.8;
      that.popped = true;
      that.sprite.interactive = false;
      sprite.gotoAndPlay(1);
      score += 1;

      if (Math.random() < (1 / 6)) {
        var bird = window.bird(that.sprite);
        birds.push(bird)
        var index = app.stage.getChildIndex(sprite);
        app.stage.addChildAt(bird.sprite, index);
        score += 1;
      }

      if (Math.random() < (1 / 8)) {
        var thomas = window.thomas(that.sprite);
        thomases.push(thomas)
        var index = app.stage.getChildIndex(sprite);
        app.stage.addChildAt(thomas.sprite, index);
        score += 3;
      }
      setScore();
    }
  }

  function resetBalloon() {
    that.sprite.visible = false;
    that.sprite.vy = -0.8;
    that.rotation = Math.atan(-that.vx / that.vy);
    that.sprite.y -= Math.random() * (app.screen.height / 2) + (app.screen.height / 2);
    that.popped = false;
    that.sprite.gotoAndStop(0);
  }

  var sprite = new PIXI.AnimatedSprite(balloonTextureArray);
  sprite.x = Math.random() * app.screen.width - (balloonFrame.x + balloonWidth / 2);
  sprite.y = Math.random() * (app.screen.height + 5);
  var wind = Math.random() * 0.3 - 0.15;
  sprite.vx = wind / 2 + Math.random() * wind; // wut
  sprite.vy = -0.8;
  sprite.rotation = Math.atan(-sprite.vx / sprite.vy); // orient the balloon to where it's heading
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
  var sprite = new PIXI.AnimatedSprite(thomasTextureArray);
  sprite.anchor.y = 0.5;
  sprite.anchor.x = 0.5;
  sprite.x = referenceSprite.x + referenceSprite.width / 2;
  sprite.y = referenceSprite.y + referenceSprite.height / 2;
  sprite.vx = Math.random() * 4 - 2;
  if (sprite.vx < 0) {
    sprite.scale.x = -1;
  }
  sprite.vy = -1.5;
  sprite.interactive = false;
  sprite.play();
  sprite.animationSpeed = 0.18;

  var that = {
    sprite: sprite
  };
  return that;
}

function bird(referenceSprite) {
  var sprite = new PIXI.AnimatedSprite(birdTextureArray);
  sprite.anchor.y = 0.5;
  sprite.anchor.x = 0.5;
  sprite.x = referenceSprite.x + referenceSprite.width / 2;
  sprite.y = referenceSprite.y + referenceSprite.height / 2;
  sprite.vx = (Math.random() > 0.5 ? -1 : 1) * 3;
  if (sprite.vx < 0) {
    sprite.scale.x = -1;
  }
  sprite.vy = -2;
  sprite.interactive = false;
  sprite.play();
  sprite.animationSpeed = 0.18;

  var that = {
    sprite: sprite
  };
  return that;
}

/*
* BROWSER EVENTS
*/

window.onload = function () {
  // add eventListener
  document.addEventListener(
    "keydown",
    function (key) {
      //If left or right arrow key...
      if (event.keyCode === 37 || event.keyCode === 39) {
        sway(event.keyCode === 37);
      }
    }, false
  );

  // add eventListener for tizen specific events
  document.addEventListener('tizenhwkey', function (e) {
    if (e.keyName === "back") {
      try {
        tizen.application.getCurrentApplication().exit();
      } catch (ignore) { }
    }
  });

  document.addEventListener("rotarydetent", function (ev) {
    var direction = ev.detail.direction;
    sway(direction == "CCW"); //Turned counter-clockwise
  });
};
/*
 * PIXI.JS GAME
 */

PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SORTABLE_CHILDREN = true;

var balloons = [];
var flyingObjects = [];
var scoreChangeCooldown = 0; //How long until we dequeue the next score change
var scoreChangeQueue = []; //A queue of score changes to be displayed
var scoreChangeSprites = []; //The displayed score changes
var balloonImages = [
  "./images/animations/balloon/frame_0_delay-0.1s.png",
  "./images/animations/balloon/frame_1_delay-0.1s.png",
  "./images/animations/balloon/frame_2_delay-0.1s.png",
  "./images/animations/balloon/frame_3_delay-0.1s.png",
  "./images/animations/balloon/frame_4_delay-0.1s.png",
  "./images/animations/balloon/frame_5_delay-0.1s.png",
  "./images/animations/balloon/frame_6_delay-0.1s.png"
];
var birdImages = [
  "./images/animations/birds1.png",
  "./images/animations/birds2.png"
];
var thomasImages = [
  "./images/animations/thomas1.png",
  "./images/animations/thomas2.png"
];
var cscrocImages = [
  "./images/animations/cscroc/frame_0_delay-0.02s.png",
  "./images/animations/cscroc/frame_1_delay-0.02s.png",
  "./images/animations/cscroc/frame_2_delay-0.02s.png",
  "./images/animations/cscroc/frame_3_delay-0.02s.png",
  "./images/animations/cscroc/frame_4_delay-0.02s.png",
  "./images/animations/cscroc/frame_5_delay-0.02s.png",
  "./images/animations/cscroc/frame_6_delay-0.02s.png",
  "./images/animations/cscroc/frame_7_delay-0.02s.png",
  "./images/animations/cscroc/frame_8_delay-0.02s.png"
];
var artiksImages = [
  "./images/animations/artiks/frame_00_delay-0.09s.png",
  "./images/animations/artiks/frame_01_delay-0.09s.png",
  "./images/animations/artiks/frame_02_delay-0.09s.png",
  "./images/animations/artiks/frame_03_delay-0.09s.png",
  "./images/animations/artiks/frame_04_delay-0.09s.png",
  "./images/animations/artiks/frame_05_delay-0.09s.png",
  "./images/animations/artiks/frame_06_delay-0.09s.png",
  "./images/animations/artiks/frame_07_delay-0.09s.png",
  "./images/animations/artiks/frame_08_delay-0.09s.png",
  "./images/animations/artiks/frame_09_delay-0.09s.png",
  "./images/animations/artiks/frame_10_delay-0.09s.png",
  "./images/animations/artiks/frame_11_delay-0.09s.png",
];
var mantmantImages = [
  "./images/animations/mantmant/mantmant1.png",
  "./images/animations/mantmant/mantmant2.png",
  "./images/animations/mantmant/mantmant3.png",
];
var icons = [
  "./images/icons/heart.png",
  "./images/icons/cart.png",
  "./images/icons/plus.png",
  "./images/icons/drill.png",
  "./images/icons/mantmant.png",
];
var far, scoreboard, shopbutton, shopcontainer, shopbg, shopitems, shopclose;
var backgroundUrl = "./images/bluebackground.png";
var balloonTextureArray = [];
var balloonHeight = 141;
var balloonWidth = 123;
var balloonCenter = { x: 112 / 2, y: 122 / 2 };
var balloonFrame = new PIXI.Rectangle(84, 62, balloonWidth, balloonHeight);
var balloonHitArea = new PIXI.Ellipse(balloonFrame.x + balloonCenter.x, balloonFrame.y + balloonCenter.y, balloonCenter.x, balloonCenter.y);

var birdTextureArray = [];
var thomasTextureArray = [];
var cscrocTextureArray = [];
var artiksTextureArray = [];
var mantmantTextureArray = [];

// global variables
var wind = 0;
var score = 0;
var powers = {
  Crocnosa: false,
};

var app = new PIXI.Application({
  sharedLoader: true,
  width: window.innerWidth,
  height: window.innerHeight,
  autoDensity: true,
  antialias: true,
  resizeTo: window,
  backgroundColor: 0xF0F0F0
});
document.body.appendChild(app.view);

/* Loading screen */
var load_progress = 0;
var total_files = [
  balloonImages,
  [backgroundUrl],
  birdImages,
  thomasImages,
  icons,
  cscrocImages,
].map((i) => i.length).reduce((a, b) => a + b, 0);
PIXI.Loader.shared.onProgress.add(() => {
  load_progress += 1;
  document.getElementById("loadingstatus").value = load_progress / total_files * 100;
});
PIXI.Loader.shared.onComplete.add(() => {
  let elem = document.getElementById("loading");
  elem.parentNode.removeChild(elem);
});

/* Load files */
PIXI.Loader.shared
  .add(balloonImages)
  .add(backgroundUrl)
  .add(birdImages)
  .add(thomasImages)
  .add(icons)
  .add(cscrocImages)
  .load(setup);

function balloon() {
  function onClick(e) {
    if (shopcontainer.visible) return;  // Do nothing while shop is open
    if (that.popped === false) {
      that.sprite.vy = -0.8;
      that.popped = true;
      that.sprite.interactive = false;
      sprite.gotoAndPlay(1);

      scoreChangeQueue.push(1);

      if (Math.random() < (1 / 6)) {
        var b = createSprite(that.sprite, birdTextureArray, 0.18, Math.random() * 4 - 2, -2)
        flyingObjects.push(b)
        app.stage.addChildAt(b.sprite, app.stage.getChildIndex(sprite));

        scoreChangeQueue.push(1);
      }
      if (Math.random() < (1 / 8)) {
        var t = createSprite(that.sprite, thomasTextureArray, 0.18, Math.random() * 6 - 3, -1.5);
        flyingObjects.push(t);
        app.stage.addChildAt(t.sprite, app.stage.getChildIndex(sprite));

        scoreChangeQueue.push(3);
      }
      /* CS */
      if (powers.Crocnosa && Math.random() < (1 / 6)) {
        var t = createSprite(that.sprite, cscrocTextureArray, 0.16, Math.random() * 4 - 2, -1.0);
        flyingObjects.push(t);
        app.stage.addChildAt(t.sprite, app.stage.getChildIndex(sprite));

        scoreChangeQueue.push(15);
      }
      if (powers.Artiks && Math.random() < (1 / 6)) {
        var a = createSprite(that.sprite, artiksTextureArray, 0.09, Math.random() * 6 - 3, -3.0, reversed = true);
        flyingObjects.push(a);
        app.stage.addChildAt(a.sprite, app.stage.getChildIndex(sprite));

        scoreChangeQueue.push(15);
      }
      /* OCs */
      if (powers.Mantmant && Math.random() < (1 / 6)) {
        let a = createSprite(that.sprite, mantmantTextureArray, 0.09, Math.random() * 2 - 1, -1, reversed = true);
        flyingObjects.push(a);
        app.stage.addChildAt(a.sprite, app.stage.getChildIndex(sprite));

        scoreChangeQueue.push(15);
      }
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

function createSprite(referenceSprite, textureArray, animationSpeed, vx, vy, reversed = false) {
  var sprite = new PIXI.AnimatedSprite(textureArray);
  sprite.anchor.set(0.5);
  sprite.x = referenceSprite.x + referenceSprite.width / 2;
  sprite.y = referenceSprite.y + referenceSprite.height / 2;
  sprite.vx = vx;
  if (sprite.vx < 0) {
    sprite.scale.x = -1;
  }
  if (reversed) {
    sprite.scale.x = -sprite.scale.x;
  }
  sprite.vy = vy;
  sprite.interactive = false;
  sprite.play();
  sprite.animationSpeed = animationSpeed;

  return {
    sprite: sprite
  };
}

function setupShop() {
  shopbutton = new PIXI.Sprite(PIXI.Texture.from(icons[1]));
  shopclose = new PIXI.Sprite(PIXI.Texture.from(icons[2]));

  function onButtonOver() {
    this.tint = 0xFFFF00;
  }
  function onButtonOut() {
    this.tint = 0xFFFFFF;
  }

  shopbutton.anchor.set(1);
  shopbutton.interactive = true;
  shopbutton.buttonMode = true;

  shopbutton
    .on('pointerdown', shop)
    //.on('pointerup', onButtonUp)
    //.on('pointerupoutside', onButtonUp)
    .on('pointerover', onButtonOver)
    .on('pointerout', onButtonOut);

  shopclose.rotation = Math.PI / 4;
  shopclose.zIndex = 3;
  shopclose.anchor.set(0.5);
  shopclose.interactive = true;
  shopclose.buttonMode = true;
  shopclose.on('pointerdown', () => {
    shopcontainer.visible = false;
  });

  shopcontainer = new PIXI.Container();
  shopcontainer.visible = false;
  shopcontainer.zIndex = 2;

  shopbg = new PIXI.Sprite(PIXI.Texture.WHITE);
  shopbg.tint = 0x515151;
  shopbg.alpha = 0.8;

  let items = [
    { name: "Crocnosa", price: 75, sprite: icons[0], tint: 0xE74C3C },
    { name: "Artiks", price: 75, sprite: icons[3], tint: 0x435C9E },
    { name: "Mantmant", price: 75, sprite: icons[4], tint: 0xAAAAAA }
  ];

  shopitems = [];
  items.forEach((i) => {
    let sprite = new PIXI.Sprite(PIXI.Texture.from(i.sprite));
    sprite.tint = i.tint;
    sprite.zIndex = 3;
    PIXI.BitmapFont.from("ShopFont", {
      fill: "#000000",
      fontSize: 20,
      fontWeight: 'bold',
    }, { chars: PIXI.BitmapFont.ASCII });
    let text = new PIXI.BitmapText(
      i.name + "\n$" + i.price.toString(), {
      fontName: "ShopFont",
    }
    );
    text.zIndex = 3;
    text.anchor.set(0.5);

    sprite.interactive = true;
    sprite.buttonMode = true;
    function onClick() {
      if (score < i.price) return;
      score = score - i.price;
      this.tint = 0x404040;
      this.interactive = false;
      powers[i.name] = true;
      setScore();
    }
    sprite.on('pointerdown', onClick);

    shopitems.push({ sprite: sprite, text: text, name: i.name });
    shopcontainer.addChild(sprite);
    shopcontainer.addChild(text);
  });

  shopcontainer.addChild(shopclose);
  shopcontainer.addChild(shopbg);
}

function shop() {
  shopcontainer.visible = true;
}

function resizeElements() {
  // Perform all actions that require the screen size (place things...)
  far.width = app.screen.width;
  far.height = app.screen.height;
  scoreboard.position.set(app.screen.width - 10, app.screen.height - 10);
  shopbutton.position.set(app.screen.width - 4, 50);
  // Resize shop
  if (app.screen.height > 400 && app.screen.width > 800) {
    shopbg.height = 400;
    shopbg.width = 800;
  } else {
    shopbg.width = app.screen.width - 40;
    shopbg.height = app.screen.height - 40;
  }
  shopbg.position.set(
    (app.screen.width / shopcontainer.scale.x - shopbg.width) / 2,
    (app.screen.height / shopcontainer.scale.y - shopbg.height) / 2
  );
  shopclose.position.set(
    shopbg.position.x + shopbg.width,
    shopbg.position.y
  );
  // Resize shop items
  let side = Math.floor(shopbg.width / 4);
  let nbw = Math.min(Math.max(Math.floor(shopbg.width / side) - 1, 1), 4);
  let padw = Math.floor((shopbg.width % side) / (nbw + 1));
  let i = 0;
  shopitems.forEach((e) => {
    e.sprite.height = Math.min(side, e.sprite.height / e.sprite.width * side);
    e.sprite.width = side;
    e.sprite.position.set(
      shopbg.position.x + padw * (i % nbw + 1) + side * i,
      shopbg.position.y + padw * (Math.floor(i / nbw) + 1) + side * Math.floor(i / nbw)
    );
    e.text.position.set(
      e.sprite.x + e.sprite.width / 2,
      e.sprite.y + e.sprite.height + 2
    );
    i++;
  });
}

function setup() {

  let farTexture = PIXI.Texture.from(backgroundUrl);
  far = new PIXI.TilingSprite(farTexture, 250, 250);
  far.position.x = 0;
  far.position.y = 0;
  app.stage.addChild(far);

  balloonImages.forEach((i) => {
    balloonTextureArray.push(PIXI.Texture.from(i));
  });
  birdImages.forEach((i) => {
    birdTextureArray.push(PIXI.Texture.from(i));
  });
  thomasImages.forEach((i) => {
    thomasTextureArray.push(PIXI.Texture.from(i));
  });
  cscrocImages.forEach((i) => {
    cscrocTextureArray.push(PIXI.Texture.from(i));
  });
  artiksImages.forEach((i) => {
    artiksTextureArray.push(PIXI.Texture.from(i));
  });
  mantmantImages.forEach((i) => {
    mantmantTextureArray.push(PIXI.Texture.from(i));
  });

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
    let b = balloon();
    balloons.push(b);
    app.stage.addChild(b.sprite);
  }

  setupShop();
  app.stage.addChild(shopbutton);
  app.stage.addChild(shopcontainer);

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

  for (var i = 0; i < flyingObjects.length; i++) {
    var obj = flyingObjects[i];
    obj.sprite.x += (1 + delta) * obj.sprite.vx;
    obj.sprite.y += (1 + delta) * obj.sprite.vy;
    if (obj.sprite.y < -obj.sprite.height) {
      app.stage.removeChild(obj);
      flyingObjects.splice(i, 1);
      i--;
    }
  }

  //Score Change Indicators
  scoreChangeCooldown -= delta;
  if(scoreChangeCooldown <= 0){
    scoreChangeCooldown = 10;
    if(scoreChangeQueue.length > 0){
      //Dequeue
      let scoreChange = scoreChangeQueue.slice(0,1)[0];
      scoreChangeQueue = scoreChangeQueue.slice(1);

      //Change score      
      score += scoreChange;
      setScore();
      
      let style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "gold",
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 2,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 3,
      });
      var scoreChangeSprite = new PIXI.Text("", style);
      scoreChangeSprite.zIndex = 2;
      scoreChangeSprite.anchor.x = 1;
      scoreChangeSprite.anchor.y = 1;
      scoreChangeSprite.vy = -0.8;
      scoreChangeSprite.text = "+"+scoreChange;      
      scoreChangeSprite.position.set(scoreboard.x, scoreboard.y - 22);
      app.stage.addChild(scoreChangeSprite);
      scoreChangeSprites.push(scoreChangeSprite);
    }
  }

  for (var i = 0; i < scoreChangeSprites.length; i++) {
    var obj = scoreChangeSprites[i];    
    obj.position.y += (1 + delta) * obj.vy;
    if (obj.position.y < (scoreboard.y - 75)) {
      app.stage.removeChild(obj);
      scoreChangeSprites.splice(i, 1);
      i--;
    }
  }

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

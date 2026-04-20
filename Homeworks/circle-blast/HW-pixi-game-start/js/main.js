// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application();

let sceneWidth, sceneHeight;

// aliases
let stage;
let assets;

// game variables
let startScene;
let gameScene, ship, scoreLabel, lifeLabel, shootSound, hitSound, fireballSound, gameOverScoreLabel;
let gameOverScene;

let circles = [];
let bullets = [];
let aliens = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

// Load all assets
loadImages();

async function loadImages() {
  // https://pixijs.com/8.x/guides/components/assets#loading-multiple-assets
    PIXI.Assets.addBundle("sprites", {
    spaceship: "images/spaceship.png",
    explosions: "images/explosions.png",
    move: "images/move.png",
    });

  // The second argument is a callback function that is called whenever the loader makes progress.
    assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
    console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
    });

    setup();
}

async function setup() {
    await app.init({ width: 600, height: 600 });

    document.body.appendChild(app.canvas);

    stage = app.stage;
    sceneWidth = app.renderer.width;
    sceneHeight = app.renderer.height;

  // #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

  // #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

  // #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

  // #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

 // #5 - Create ship
    ship = new Ship(assets.spaceship);
    gameScene.addChild(ship);
    

// #6 - Load Sounds
    shootSound = new Howl({
        src: ["sounds/shoot.wav"],
    });

    hitSound = new Howl({
        src: ["sounds/hit.mp3"],
    });

    fireballSound = new Howl({
        src: ["sounds/fireball.mp3"],
    });

  // #7 - Load sprite sheet
    explosionTextures = loadSpriteSheet();

  // #8 - Start update loop
    app.ticker.add(gameLoop);

  // #9 - Start listening for click events on the canvas

  // Now our `startScene` is visible
  // Clicking the button calls startGame()

  //functions
    function createLabelsAndButtons(){
    let buttonStyle = {
        fill: 0xff0000,
        fontSize: 48,
        fontFamily: "Verdana",
    };

    //1 set up startScene
    //1A make top label
    let startLabel1 = new PIXI.Text({
        text: "Circel Blast!",
        style: {
            fill: 0xffffff,
            fontSize: 96,
            fontFamily: "Futura",
            stroke: {color: 0xff0000, width: 6},
        },
    });

    startLabel1.x = 50;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    //1b make middle start label
    let startLabel2 = new PIXI.Text ({
        text: "R U worthy..?",
        style: {
            fill: 0xffffff,
            fontSize: 32,
            fontFamily: "Futura",
            fontStyle: "italic",
            stroke: {color: 0xff0000, width: 6},
        },
    });

    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    //1c makie start  game button
    let startButton = new PIXI.Text({ text: "Enter, if you dare!", style: buttonStyle});
    startButton.x = (sceneWidth/2) - (startButton.width/2);
    startButton.y = sceneHeight -100;

    //eventMode instead of interative in v8 and 'cursor' instead of button mode
    startButton.eventMode = "static";
    startButton.cursor = "pointer";
    startButton.on("pointerup", startGame);
    startButton.on("pointerover", (e) => (e.target.alpha = 0.7));
    startButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
    startScene.addChild(startButton);

    //2 set up game scene
    let textStye = {
        fill: 0xffffff,
        fontSize: 18,
        fontFamily: "Futura",
        stroke: {color: 0xff0000, width: 4},
    };

    //2A make score label
    scoreLabel = new PIXI.Text({text: "", style:textStye});
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    //2B make life label
    lifeLabel = new PIXI.Text({text: "", style: textStye});
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    // 3 - set up `gameOverScene`
    // 3A - make game over text
    let gameOverText = new PIXI.Text({
        text: "Game Over!\n        :-O",
        style: {
        fill: 0xffffff,
        fontSize: 64,
        fontFamily: "Futura",
        stroke: { color: 0xff0000, width: 6 },
        },
    });
    gameOverText.x = sceneWidth / 2 - gameOverText.width / 2;
    gameOverText.y = sceneHeight / 2 - 160;
    gameOverScene.addChild(gameOverText);

    gameOverScoreLabel = new PIXI.Text({text: "", 
        style: {
            fill: 0xffffff,
            fontSize: 34,
            fontFamily: "Futura",
            stroke: { color: 0xff0000, width: 6 },
        }
    });
    gameOverScoreLabel.x = (sceneWidth / 2) - (gameOverScoreLabel.width / 2) -120;
    gameOverScoreLabel.y = sceneHeight / 2 + 40;
    gameOverScene.addChild(gameOverScoreLabel);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text({ text: "Play Again?", style: buttonStyle });
    playAgainButton.x = sceneWidth / 2 - playAgainButton.width / 2;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.eventMode = "static";
    playAgainButton.cursor = "pointer";
    playAgainButton.on("pointerup", startGame); // startGame is a function reference
    playAgainButton.on("pointerover", (e) => (e.target.alpha = 0.7)); // concise arrow function with no brackets
    playAgainButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0)); // ditto
    gameOverScene.addChild(playAgainButton);

}
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    app.canvas.onclick = fireBullet;
    levelNum = 1;
    score = 0;
    life = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    ship.x = 300;
    ship.y = 550;
    loadLevel();

    setTimeout(() => {
        paused = false;
    }, 50);
}

function increaseScoreBy(value){
    score += value;
    scoreLabel.text = `Score:   ${score}`;
}

function decreaseLifeBy(value){
    life -= value;
    life = parseInt(life); //converts to an integer
    lifeLabel.text = `Life:     ${life}%`;
}

function createCircles(numCircles = 10){
    for(let i = 0; i < numCircles; i++){
        let c = new Circle(10, 0xffff00);
        c.x = Math.random() * (sceneWidth-50) + 25;
        c.y = Math.random() * (sceneHeight-400) + 25;
        circles.push(c);
        gameScene.addChild(c);
    }
}

function loadLevel(){
  createCircles(levelNum * 5);
}

function end(){
    paused = true;

    gameOverScoreLabel.text = `Your final score: ${score}`;

    circles.forEach((c) => gameScene.removeChild(c));
    circles = [];

    bullets.forEach((b) => gameScene.removeChild(b));
    bullets = [];

    explosions.forEach((e) => gameScene.removeChild(e));
    explosions = [];

    app.canvas.onclick = null;

    gameOverScene.visible = true;
    gameScene.visible = false;
}

function fireBullet(){
    if(paused) return;

    // 3 bullets vs 1 bullet power
    if(score >= 5){
        let b1 = new Bullet(0xffffff, ship.x - 10, ship.y);
        let b2 = new Bullet(0xffffff, ship.x, ship.y);
        let b3 = new Bullet(0xffffff, ship.x + 10, ship.y);
        bullets.push(b1);
        bullets.push(b2);
        bullets.push(b3);
        gameScene.addChild(b1);
        gameScene.addChild(b2);
        gameScene.addChild(b3);
        shootSound.play();
    }
    else{
        let b = new Bullet(0xffffff, ship.x, ship.y);
        bullets.push(b);
        gameScene.addChild(b);
        shootSound.play();
    }

    let b = new Bullet(0xffffff, ship.x, ship.y);
    bullets.push(b);
    gameScene.addChild(b);
    shootSound.play();
}

function loadSpriteSheet(){
    let spriteSheet = assets.explosions;
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];
    for(let i =0; i<numFrames; i++){
        let frame = new PIXI.Texture({
            source: spriteSheet.source,
            frame: new PIXI.Rectangle(i * width, 64, width, height),
        });
        textures.push(frame);
    }
    return textures;
}

function createExplosion(x, y, frameWidth, frameHeight){
    let w2 = frameWidth/2;
    let h2 = frameHeight/2;
    let expl = new PIXI.AnimatedSprite(explosionTextures);
    expl.x = x - w2;
    expl.y = y-h2;
    expl.animattionSpeed = 1/7;
    expl.loop = false;
    expl.onComplete = () => gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}

function gameLoop(){
   if (paused) return; // keep this commented out for now

 // #1 - Calculate "delta time"
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;


 // #2 - Move Ship
    let mousePosition = app.renderer.events.pointer.global;

    let amt = 6 * dt; // at 60 fps would move abt 10% of teh dist per update

    //lerp (linear interpokate) the x and y values with lerp()

    let newX = lerp(ship.x, mousePosition.x, amt); 
    let newY = lerp(ship.y, mousePosition.y, amt);

    //keeps ship on screen
    let w2 = ship.width/2;
    let h2 = ship.height/2;
    ship.x = clamp(newX, 0 + w2, sceneWidth - w2);
    ship.y = clamp(newY, 0 + h2, sceneHeight - h2);

    ship.position = mousePosition;


  // #3 - Move Circles
    for(let c of circles){
    c.move(dt);
    if(c.x <= c.radius || c.x >= sceneWidth - c.radius){
        c.reflectX();
        c.move(dt);
    }
    if(c.y <= c.radius || c.y >= sceneHeight - c.radius){
        c.reflectY();
        c.move(dt);
    }
    }


  // #4 - Move Bullets
    for (let b of bullets) {
        b.move(dt);
    }


  // #5 - Check for Collisions
    for(let c of circles){
        //5A
        for(let b of bullets){
            if(rectsIntersect(c,b)){
                fireballSound.play();

                gameScene.removeChild(c);
                c.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
                increaseScoreBy(1);
                break;
            }
        }

        //5B
        if(c.isAlive && rectsIntersect(c,ship)){
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(20);
        }

        createExplosion(c.x,c.y,64,64);
    }
  // #6 - Now do some clean up
  //6A
    bullets = bullets.filter((b)=>b.isAlive);
    //6B
    circles = circles.filter((c)=>c.isAlive);
    //6C
    explosions = explosions.filter((e)=>e.playing);


  // #7 - Is game over?
    if (life <= 0){
    end();
        return; // return here so we skip #8 below
    }


  // #8 - Load next level

    if (circles.length == 0) {
        levelNum++;
        loadLevel();
    }
}
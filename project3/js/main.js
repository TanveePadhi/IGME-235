"use strict";

const app = new PIXI.Application();

//game screnen location
let gamepanel = document.querySelector("#game-panel");
let stage;
let sceneWidth, sceneHeight;
let startScene, gameScene, tutorialScene, gameOverScene;
let startButton, tutorialButton;
let startSprite, tutorialSprite;
let tutorialPressed = false;
let scoreLabel, lifeLabel, killLabel;
let score = 0;
let kills = 0
let life = 3;

let paused =true;

let player;
let crystals = [];
let goblins = [];

let levelNum = 1;

//all variables needed for the game

setup();
//async can be initialized after it's call
async function setup(){

    await app.init({width:700, height:550, background:"#000000"});
    gamepanel.appendChild(app.canvas);

    stage = app.stage;
    sceneWidth = app.renderer.width;
    sceneHeight = app.renderer.height;

    //start screen
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    //buttons to start scene
    //start button
    startSprite = await PIXI.Assets.load("images/start.png");
    startButton = new PIXI.Sprite(startSprite);

    //scaling
    startButton.scale.set(0.3);
    //anchor poiint
    startButton.anchor.set(0.5);
    //location
    startButton.x = 350;
    startButton.y = 260;

    //allowing interactions
    startButton.interactive = true;
    startButton.cursor = "pointer";

    //adding functionality to button press
    startButton.on("pointerup",() => {
        console.log("clicked");
        startGame();
    })

    //tinting the button on hover
    startButton.on("pointerover", (e) =>{
        e.target.tint = 0xbbbbbb;
    })

    startButton.on("pointerout", (e) =>{
        e.target.tint = 0xffffff;
    })

    //adding it to the start scene
    startScene.addChild(startButton);

    //tutoial button
    tutorialSprite = await PIXI.Assets.load("images/tutorial.png");
    tutorialButton = new PIXI.Sprite(tutorialSprite);

    //button properties being set
    tutorialButton.scale.set(0.3);
    tutorialButton.anchor.set(0.5);
    tutorialButton.x = 330;
    tutorialButton.y = 400;

    //allowin interactions
    tutorialButton.interactive = true;
    tutorialButton.cursor = "pointer";

    //adding tints with button hover
    tutorialButton.on("pointerover", (e) =>{
        e.target.tint = 0xbbbbbb;
    })

    tutorialButton.on("pointerout", (e) =>{
        e.target.tint = 0xffffff;
    })

    startScene.addChild(tutorialButton);

    //tutorial scene
    tutorialScene = new PIXI.Container();
    tutorialScene.visible = false;
    stage.addChild(tutorialScene);
    //game screen
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    //game over screen
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    createLabels();

    //button functionalities
    tutorialButton.on("pointerup",() => {
        if(tutorialPressed){
            tutorialPressed = false;
        }
        else{
            tutorialPressed = true;
        }
        console.log(tutorialPressed);

        tutorialScene.visible = tutorialPressed;

    })

    //creating player
    player = new Player(20, 0xfa668b,0,0,200);
    gameScene.addChild(player);

    app.ticker.add(gameLoop);


}

function createLabels(){

    //home page title
    let startTitle = new PIXI.Text({
    text: "GAME TITLE",
    style: {
        fill: 0x0E6752,
        fontSize: 96,
        fontFamily: "Copperplate",
        stroke: {color: 0x98f1dc, width: 8},
    },
    });

    startTitle.x = 50;
    startTitle.y = 30;
    startScene.addChild(startTitle);

    let tutorialText = new PIXI.Text({
    text: "TUTORIAL",
    style: {
    fill: 0x0E6752,
    fontSize: 40,
    fontFamily: "Copperplate",
    stroke: {color: 0x98f1dc, width: 4},
    },
    });

    tutorialText.x = 450;
    tutorialText.y = 150;
    
    tutorialScene.addChild(tutorialText);

    //game scene text
    let scoreText = {
        fill: 0xd49bfa,
        fontSize: 18,
        fontFamily: "Copperplate",
    };

    scoreLabel = new PIXI.Text({text: "s", style:scoreText});
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);


    lifeLabel = new PIXI.Text({text: "l", style: scoreText});
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    killLabel = new PIXI.Text({text: "k", style: scoreText});
    killLabel.x = 5;
    killLabel.y = 50;
    gameScene.addChild(killLabel);
    increaseKillScore(0);

    //gameover scene text
    let gameOverText = new PIXI.Text({
    text: "GAME OVER",
    style: {
        fill: 0x0E6752,
        fontSize: 96,
        fontFamily: "Copperplate",
        stroke: {color: 0x98f1dc, width: 8},
    },
    });

    gameOverText.x = 50;
    gameOverText.y = 30;
    gameOverScene.addChild(gameOverText);

}

function startGame(){
    startScene.visible = false;
    tutorialScene = false;
    gameOverScene.visible = false;
    gameScene.visible = true;

    //initializing all scores
    score = 0;
    kills = 0;
    life = 3;
    levelNum = 1;
    player.x = 100;
    player.y = 50;

    //load the level or map
    loadLevel();

    setTimeout(() => {
        paused = false;
    }, 50);
}
function increaseScoreBy(value){
    score += value;
    scoreLabel.text = `Score:   ${score}`;
}

function increaseKillScore(value){
    kills += value;
    killLabel.text = `Kills:    ${kills}`;
}

function decreaseLifeBy(value){
    life -= value;
    life = parseInt(life); //converts to an integer
    lifeLabel.text = `Life:     ${life}`;
}

function createGoblins(num){
    for(let i = 0; i < num; i++){
        let g = new Goblin(2);
        g.x = Math.random() * (sceneWidth-50) + 25;
        g.y = Math.random() * (sceneHeight-50) + 25;
        goblins.push(g);
        gameScene.addChild(g);
    }
}

function createCystals(num = 15){
    for(let i = 0; i < num; i++){
        let c = new Crystal(0xc2fffd);
        c.x = Math.random() * (sceneWidth-50) + 25;
        c.y = Math.random() * (sceneHeight-50) + 25;
        crystals.push(c);
        gameScene.addChild(c);
    }

    for(let j = 0; j < levelNum; j++){
        let s = new Crystal(0xffba0f);
        s.special = true;
        s.x = Math.random() * (sceneWidth-50) + 25;
        s.y = Math.random() * (sceneHeight-50) + 25;
        crystals.push(s);
        gameScene.addChild(s);
    }
}

function loadLevel(){
    console.log(levelNum);
    createCystals( levelNum * 15);
    //resets goblins per level
    for(let g in goblins){
        gameScene.removeChild(g);
    }
    goblins.length = 0
    createGoblins(levelNum);
    

}
function rectsIntersect(a,b){
		let ab = a.getBounds();
		let bb = b.getBounds();
		return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
	}

function end(){
    gameOverScene.visible = true;
    gameScene.visible = false;
}
function gameLoop(){
    if (paused) return;

     //frames for second in game time
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    //player movement
        if (keys[keyboard.RIGHT]) {
            player.dx = player.speed;
        } else if (keys[keyboard.LEFT]) {
            player.dx = -player.speed;
        } else {
            player.dx = 0;
        }

        if (keys[keyboard.DOWN]) {
        player.dy = player.speed;
        } else if (keys[keyboard.UP]) {
        player.dy = -player.speed;
        } else {
        player.dy = 0;
        }

        player.update(dt);

        //goblin movement
        for(let g of goblins){
            g.move(player.x, player.y);
        }

        //keeping the player inside the box
        let w2 = player.width/2;
        let h2 = player.height/2;

        if(player.x <= 0 ){
            player.x = sceneWidth - w2;
        }
        if(player.x >= sceneWidth){
            player.x = 0;
        }
        if(player.y <= 0){
            player.y = sceneHeight - h2;
        }
        if(player.y >= sceneHeight){
            player.y = 0;
        }

        //collision detection
        for(let c of crystals){
            if(c.special && c.isAlive && rectsIntersect(player, c)){
                gameScene.removeChild(c);
                c.isAlive = false;
                player.attack = true;
                break;

            }
            else if(c.isAlive && rectsIntersect(player, c)){
                gameScene.removeChild(c);
                c.isAlive = false;
                increaseScoreBy(1);
                break;
            }
        }

        //if goblins touches player player loses a health and respwans
        for(let g of goblins){
            if(rectsIntersect(player,g) && player.attack && life > 0){
                gameScene.removeChild(g);
                g.isAlive = false;
                increaseScoreBy(5);
                increaseKillScore(1);
                player.attack = false;
            }
            else if(rectsIntersect(player,g) && !player.attack && life > 0){
                decreaseLifeBy(1);
                player.x = Math.random() * (sceneWidth-50) + 25;
                player.y = Math.random() * (sceneHeight-50) + 25;
            }
        }



        //filtering the crystals to fet rids of all that have been collected
        crystals = crystals.filter((c)=>c.isAlive);
        goblins = goblins.filter ((g) => g.isAlive);
        //starting new level
        if (crystals.length == 0 || goblins.length == 0) {
            levelNum++;
            loadLevel();
        }

        if(life == 0){
            end();
        }

}

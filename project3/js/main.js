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
let score, life, kills;

let player;
let crystals = [];
let goblins = [];

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
    startButton.x = 320;
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
    tutorialButton.x = 300;
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
    player = new Player(10, 0x112233,0,0,75);
    gameScene.addChild(player);

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
    //increaseScoreBy(0);


    lifeLabel = new PIXI.Text({text: "l", style: scoreText});
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    //decreaseLifeBy(0);

    killLabel = new PIXI.Text({text: "k", style: scoreText});
    killLabel.x = 5;
    killLabel.y = 50;
    gameScene.addChild(killLabel);
    //increaseScoreBy(0);

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
    life = 3;
    kills = 0;
}

function gameLoop(){
    
}
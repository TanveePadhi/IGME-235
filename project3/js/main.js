"use strict";

const app = new PIXI.Application();

//game screnen location
let gamepanel = document.querySelector("#game-panel");
let stage;
let sceneWidth, sceneHeight;
let startScene, gameScene, tutorialScene, gameOverScene, winScene;
let startButton, tutorialButton, playAgainButton, playAgainButtonWin;
let startSprite, tutorialSprite, playAgainSprite, playerSprite, goblinSprite;
let tutorialPressed = false;
let scoreLabel, goblinScoreLabel, lifeLabel, killLabel, gameOverScoreLabel, gameSceneLabel, winSceneLabel;
let score = 0;
let goblinScore = 0;
let kills = 0;
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

    //setting up the window for the game
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
    startButton.x = sceneWidth/2;
    startButton.y = 260;

    //allowing interactions
    startButton.interactive = true;
    startButton.cursor = "pointer";

    //adding functionality to button press
    startButton.on("pointerup",() => {
        startGame();
    });

    //tinting the button on hover
    startButton.on("pointerover", (e) =>{
        e.target.tint = 0xbbbbbb;
    });

    startButton.on("pointerout", (e) =>{
        e.target.tint = 0xffffff;
    });

    //adding it to the start scene
    startScene.addChild(startButton);

    //tutoial button
    tutorialSprite = await PIXI.Assets.load("images/tutorial.png");
    tutorialButton = new PIXI.Sprite(tutorialSprite);

    //button properties being set
    tutorialButton.scale.set(0.3);
    tutorialButton.anchor.set(0.5);
    tutorialButton.x = sceneWidth/2;
    tutorialButton.y = 400;

    //allowin interactions
    tutorialButton.interactive = true;
    tutorialButton.cursor = "pointer";

    //adding tints with button hover
    tutorialButton.on("pointerover", (e) =>{
        e.target.tint = 0xbbbbbb;
    });

    tutorialButton.on("pointerout", (e) =>{
        e.target.tint = 0xffffff;
    });

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

    //play agian button
    playAgainSprite = await PIXI.Assets.load("images/playAgain.png");
    playAgainButton = new PIXI.Sprite(playAgainSprite);

    playAgainButton.scale.set(0.3);
    playAgainButton.anchor.set(0.5);

    playAgainButton.x = sceneWidth/2;
    playAgainButton.y = 350;

    playAgainButton.interactive = true;
    playAgainButton.cursor = "pointer";

    playAgainButton.on("pointerover", (e) =>{
        e.target.tint = 0xbbbbbb;
    });

    playAgainButton.on("pointerout", (e) =>{
        e.target.tint = 0xffffff;
    });

    playAgainButton.on("pointerup", home);

    gameOverScene.addChild(playAgainButton);

    winScene = new PIXI.Container();
    winScene.visible = false;
    stage.addChild(winScene);

    playAgainButtonWin = new PIXI.Sprite(playAgainSprite);
    playAgainButtonWin.scale.set(0.3);
    playAgainButtonWin.anchor.set(0.5);
    playAgainButtonWin.x = sceneWidth/2;
    playAgainButtonWin.y = 350;

    playAgainButtonWin.interactive = true;
    playAgainButtonWin.cursor = "pointer";

    playAgainButtonWin.on("pointerover", (e) =>{
        e.target.tint = 0xbbbbbb;
    });

    playAgainButtonWin.on("pointerout", (e) =>{
        e.target.tint = 0xffffff;
    });

    playAgainButtonWin.on("pointerup", (home));

    winScene.addChild(playAgainButtonWin);

    createLabels();

    //button functionalities
    tutorialButton.on("pointerup",() => {
        if(tutorialPressed){
            tutorialPressed = false;
        }
        else{
            tutorialPressed = true;
        }

        tutorialScene.visible = tutorialPressed;

    });
    playerSprite = await PIXI.Assets.load("images/player.png");
    goblinSprite = await PIXI.Assets.load("images/goblin.png");
    //creating player
    player = new Player(playerSprite);
    gameScene.addChild(player);

    app.ticker.add(gameLoop);

}

function createLabels(){

    //home page text
    let startTitle = new PIXI.Text({
    text: "Escape Goblinland",
    style: {
        fill: 0x0E6752,
        fontSize: 60,
        fontFamily: "Uncial Antiqua",
        stroke: {color: 0xf0bb90, width: 6},
    },
    });

    startTitle.anchor.set(0.5);
    startTitle.x = sceneWidth/2;
    startTitle.y = 100;
    startScene.addChild(startTitle);

    //tutorial title
    let tutorialText = new PIXI.Text({
    text: "TUTORIAL",
    style: {
    fill: 0x0E6752,
    fontSize: 40,
    fontFamily: "Uncial Antiqua",
    stroke: {color: 0xf0bb90, width: 4},
    },
    });

    tutorialText.x = 450;
    tutorialText.y = 150;
    
    tutorialScene.addChild(tutorialText);

    // arrow buttons and crystals for tutorial
    let up = new PIXI.Graphics();
    up.rect(500,210,30,30).fill(0x96e3c9);
    tutorialScene.addChild(up);

    let down = new PIXI.Graphics();
    up.rect(500,245,30,30).fill(0x96e3c9);
    tutorialScene.addChild(down);

    let left = new PIXI.Graphics();
    up.rect(465,245,30,30).fill(0x96e3c9);
    tutorialScene.addChild(left);

    let right = new PIXI.Graphics();
    up.rect(535,245,30,30).fill(0x96e3c9);
    tutorialScene.addChild(right);

    let normCryst = new PIXI.Graphics();
    up.rect(465,300,5,10).fill(0xc2fffd);
    tutorialScene.addChild(normCryst);

    let specCryst = new PIXI.Graphics();
    up.rect(465,350,5,10).fill(0xffba0f);
    tutorialScene.addChild(specCryst);

    //arrow text for tutorial

    let upArr = new PIXI.Text({
        text: "↑",
        style: {
        fill: 0x0E6752,
        fontSize: 20,
        fontFamily: "Uncial Antiqua",
    },
    });

    upArr.x = 509;
    upArr.y = 210;

    tutorialScene.addChild(upArr);

    let downArr = new PIXI.Text({
        text: "↓",
        style: {
        fill: 0x0E6752,
        fontSize: 20,
        fontFamily: "Uncial Antiqua",
    },
    });

    downArr.x = 509;
    downArr.y = 245;

    tutorialScene.addChild(downArr);

    let lftArr = new PIXI.Text({
        text: "←",
        style: {
        fill: 0x0E6752,
        fontSize: 20,
        fontFamily: "Uncial Antiqua",
    },
    });

    lftArr.x = 470;
    lftArr.y = 245;

    tutorialScene.addChild(lftArr);

    let rtArr = new PIXI.Text({
        text: "→",
        style: {
        fill: 0x0E6752,
        fontSize: 20,
        fontFamily: "Uncial Antiqua",
    },
    });

    rtArr.x = 540;
    rtArr.y = 245;

    tutorialScene.addChild(rtArr);

    let instructions = new PIXI.Text({
        text: "Click any of\nthe arrow \nbuttons to\nmove or WASD",
        style: {
        fill: 0xf0bb90,
        fontSize: 14,
        fontFamily: "Uncial Antiqua",
    },
    });

    instructions.x = 580;
    instructions.y = 210;

    tutorialScene.addChild(instructions);

    let nCrystInfo = new PIXI.Text({
        text: "Collect for 1 point",
        style: {
        fill: 0xf0bb90,
        fontSize: 14,
        fontFamily: "Uncial Antiqua",
    },
    });

    nCrystInfo.x = 485;
    nCrystInfo.y = 295;

    tutorialScene.addChild(nCrystInfo);

    let sCrystInfo = new PIXI.Text({
        text: "Collect to attack goblins\nYou only get one chance.",
        style: {
        fill: 0xf0bb90,
        fontSize: 14,
        fontFamily: "Uncial Antiqua",
    },
    });

    sCrystInfo.x = 485;
    sCrystInfo.y = 345;

    tutorialScene.addChild(sCrystInfo);

    //game scene text
    let textSpace = new PIXI.Graphics().rect(0,0,sceneWidth, 75).fill(0x4f4f51);
    gameScene.addChild(textSpace);
    let scoreText = {
        fill: 0xd49bfa,
        fontSize: 18,
        fontFamily: "Copperplate",
    };

    scoreLabel = new PIXI.Text({text: "", style:scoreText});
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    goblinScoreLabel = new PIXI.Text({text: "",
        style:{
        fill:0x119955,
        fontSize: 18,
        fontFamily: "Copperplate",
        }
    });
    goblinScoreLabel.x = 150;
    goblinScoreLabel.y = 5;
    gameScene.addChild(goblinScoreLabel);
    increaseGoblinScoreBy(0);


    lifeLabel = new PIXI.Text({text: "", style: scoreText});
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    killLabel = new PIXI.Text({text: "", style: scoreText});
    killLabel.x = 5;
    killLabel.y = 50;
    gameScene.addChild(killLabel);
    increaseKillScore(0);

    gameSceneLabel = new PIXI.Text({
        text: "Defeat all Goblins to move on",
        style: {
            fill: 0xf0bb90,
            fontSize: 30,
            fontFamily: "Uncial Antiqua",
        }
    });

    gameSceneLabel.anchor.set(0.5);
    gameSceneLabel.x = sceneWidth/2 + 50;
    gameSceneLabel.y = 50;

    gameScene.addChild(gameSceneLabel);

    //gameover scene text
    let gameOverText = new PIXI.Text({
    text: "GAME OVER",
    style: {
        fill: 0x0E6752,
        fontSize: 96,
        fontFamily: "Uncial Antiqua",
        stroke: {color: 0xf0bb90, width: 8},
    }
    });

    gameOverText.anchor.set(0.5);

    gameOverText.x = sceneWidth/2;
    gameOverText.y = 100;
    gameOverScene.addChild(gameOverText);

    gameOverScoreLabel = new PIXI.Text({
        text: "",
        style: {
        fill: 0x0E6752,
        fontSize: 45,
        fontFamily: "Uncial Antiqua",
        stroke: {color: 0xf0bb90, width: 3},
    }
    });

    gameOverScoreLabel.anchor.set(0.5);

    gameOverScoreLabel.x = sceneWidth/2;
    gameOverScoreLabel.y = 200;
    gameOverScene.addChild(gameOverScoreLabel);

    winSceneLabel = new PIXI.Text({
    text: "YOU ESCAPED!!",
    style: {
        fill: 0x0E6752,
        fontSize: 75,
        fontFamily: "Uncial Antiqua",
        stroke: {color: 0xf0bb90, width: 8},
    }
    });

    winSceneLabel.anchor.set(0.5);

    winSceneLabel.x = sceneWidth/2;
    winSceneLabel.y = 100;
    winScene.addChild(winSceneLabel);

}

function startGame(){
    startScene.visible = false;
    tutorialScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;

    //re initializing all scores
    score = 0;
    goblinScore = 0;
    kills = 0;
    life = 3;
    levelNum = 1;
    player.x = 100;
    player.y = 150;


    //resets all scores
    increaseScoreBy(0);
    decreaseLifeBy(0);
    increaseKillScore(0);
    increaseGoblinScoreBy(0);

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

function increaseGoblinScoreBy(value){
    goblinScore += value;
    goblinScoreLabel.text = `Goblin Score:   ${goblinScore}`;
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
        let g = new Goblin(goblinSprite,1.5);
        g.x = (sceneWidth/2) + Math.random() * (sceneWidth-50);
        g.y = Math.random() * (sceneHeight-50) + 100;
        goblins.push(g);
        gameScene.addChild(g);
    }
}

function createCystals(num = 15){
    //normal crystals
    for(let i = 0; i < num; i++){
        let c = new Crystal(0xc2fffd);
        c.x = Math.random() * (sceneWidth-50) + 25;
        c.y = 100 + Math.random() * (sceneHeight-100);
        crystals.push(c);
        gameScene.addChild(c);
    }

    //special crystals
    for(let j = 0; j < levelNum; j++){
        let s = new Crystal(0xffba0f);
        s.special = true;
        s.x = Math.random() * (sceneWidth-50) + 25;
        s.y = 100 + Math.random() * (sceneHeight-100);
        crystals.push(s);
        gameScene.addChild(s);
    }
}

function loadLevel(){
    //console.log(levelNum);
    createCystals( levelNum * 15);
    //resets goblins per level
    for(let g of goblins){
        gameScene.removeChild(g);
        goblins.pop();
    }
    createGoblins(levelNum);
    

}
function rectsIntersect(a,b){
		let ab = a.getBounds();
		let bb = b.getBounds();
		return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
	}

function collision(a,b){

        let x = Math.pow((a?.x - b?.x),2);
        let y = Math.pow((a?.y - b?.y),2);
        let dist = x + y;
        let rDist = Math.pow((a?.radius + b?.radius),2);

        return dist <= rDist;
    }

function end(){
    paused = true;

    gameOverScoreLabel.text = `Final Score: ${score}`;

    //resettings all goblins
    goblins.forEach((g) => gameScene.removeChild(g));
    goblins = [];

    crystals.forEach((c) => gameScene.removeChild(c));
    crystals = [];

    app.canvas.onclick = null;

    gameOverScene.visible = true;
    gameScene.visible = false;
}

function win(){
    paused = true;



     //resettings all goblins
    goblins.forEach((g) => gameScene.removeChild(g));
    goblins = [];

    crystals.forEach((c) => gameScene.removeChild(c));
    crystals = [];

    winScene.visible = true;
    gameOverScene.visible = false;
    gameScene.visible = false;
    tutorialScene.visible = false;
    startScene.visible = false;
}

function home(){
    paused = true;

    goblins.forEach((g) => gameScene.removeChild(g));
    goblins = [];

    crystals.forEach((c) => gameScene.removeChild(c));
    crystals = [];

    winScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = false;
    tutorialScene.visible = false;
    startScene.visible = true;

}
function gameLoop(){
    if (paused) return;

     //frames for second in game time
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    //player movement
        if (keys[keyboard.RIGHT] || keys[keyboard.D]) {
            player.dx = player.speed;
        } else if (keys[keyboard.LEFT] || keys[keyboard.A]) {
            player.dx = -player.speed;
        } else {
            player.dx = 0;
        }

        if (keys[keyboard.DOWN] || keys[keyboard.S]) {
        player.dy = player.speed;
        } else if (keys[keyboard.UP] || keys[keyboard.W]) {
        player.dy = -player.speed;
        } else {
        player.dy = 0;
        }

        player.update(dt);

        //goblin movement
        for(let g of goblins){
            g.move(player.x, player.y);
            if(g.x <= 0 ){
                g.x = 0;
            }
            if(g.x >= sceneWidth){
                g.x = sceneWidth - 20;
            }
            if(g.y <= 100){
                g.y = 100;
            }
            if(g.y >= sceneHeight){
                g.y = sceneHeight- 120;
            }
            
        }

        //keeping the player inside the box but can move from sides to side (teleporting)

        if(player.x <= 0 ){
            player.x = sceneWidth - 1;
        }
        if(player.x >= sceneWidth){
            player.x = 0;
        }
        if(player.y <= 100){
            player.y = sceneHeight - 1;
        }
        if(player.y >= sceneHeight){
            player.y = 100;
        }

        //collision detection
        for(let c of crystals){
            //checks if the player colelcted special crystal that can allow them attack 
            if(c.special && c.isAlive && rectsIntersect(player, c)){
                gameScene.removeChild(c);
                c.isAlive = false;
                player.attack = true;
                break;

            }
            //checks if the player is just collecting crstals
            else if(c.isAlive && rectsIntersect(player, c)){
                gameScene.removeChild(c);
                c.isAlive = false;
                increaseScoreBy(1);
                break;
            }
            //checks if the goblin collects the crystal
            for(let g of goblins){
                if(c.isAlive && rectsIntersect(g, c) && !c.special){
                    gameScene.removeChild(c);
                    c.isAlive = false;
                    increaseGoblinScoreBy(1);
                    break;
                }
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
                player.x = 100;
                player.y = 150;
            }
        }
        

        //when goblins collide with each other
        for(let g = 0; g < goblins.length; g++){
            if(goblins.length == 1 && g == (goblins.length-1)){
                break;
            }

            if(collision(goblins[g],goblins[g+1])){

                goblins[g].x = Math.random() * (sceneWidth-50) + 25;
                goblins[g].y = Math.random() * (sceneHeight-50) + 120;

                goblins[g+1].x = Math.random() * (sceneWidth-50) + 25;
                goblins[g+1].y = Math.random() * (sceneHeight-50) + 120;
            }

        }

        //filtering the crystals to fet rids of all that have been collected
        crystals = crystals.filter((c)=>c.isAlive);
        goblins = goblins.filter ((g) => g.isAlive);


    //checkin if the player can attack
    if(player.attack){
        player.tint = 0xff0000;
    }
    else{
        player.tint = 0xffffff;
    }

        //starting new level
        if (goblins.length == 0) {
            levelNum++;
            loadLevel();
        }

        if(life == 0){
            end();
        }

        if(score >= 100){
            win();
        }

}

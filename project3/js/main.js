"use strict";

const app = new PIXI.Application();

//game screnen location
let gamepanel = document.querySelector("#game-panel");
let stage;
let sceneWidth, sceneHeight;
let startScene, gameScene, tutorialScene, gameOverScene;
let startButton, tutorialButton, playAgainButton;
let startSprite, tutorialSprite, playAgainSprite;
let tutorialPressed = false;
let scoreLabel, goblinScoreLabel, lifeLabel, killLabel, gameOverScoreLabel;
let score = 0;
let goblinScore = 0;
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
        //console.log("clicked");
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

    //play agian button
    playAgainSprite = await PIXI.Assets.load("images/play-again-button-pixel.png");
    playAgainButton = new PIXI.Sprite(playAgainSprite);

    playAgainButton.scale.set(0.3);
    playAgainButton.anchor.set(0.5);

    playAgainButton.x = 350;
    playAgainButton.y = 260;

    playAgainButton.interactive = true;
    playAgainButton.cursor = "pointer";

    playAgainButton.on("pointerover", (e) =>{
        e.target.tint = 0xbbbbbb;
    })

    playAgainButton.on("pointerout", (e) =>{
        e.target.tint = 0xffffff;
    })

    playAgainButton.on("pointerup", startGame);

    gameOverScene.addChild(playAgainButton)

    createLabels();

    //button functionalities
    tutorialButton.on("pointerup",() => {
        if(tutorialPressed){
            tutorialPressed = false;
        }
        else{
            tutorialPressed = true;
        }
        //console.log(tutorialPressed);

        tutorialScene.visible = tutorialPressed;

    })

    //creating player
    player = new Player(20, 0xfa668b,0,0,200);
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

    startTitle.x = 40;
    startTitle.y = 30;
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
    })

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
    })

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
    })

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
    })

    rtArr.x = 540;
    rtArr.y = 245;

    tutorialScene.addChild(rtArr);

    let instructions = new PIXI.Text({
        text: "Click any of\nthe arrow \nbuttons to\nmove",
        style: {
        fill: 0xf0bb90,
        fontSize: 14,
        fontFamily: "Uncial Antiqua",
    },
    })

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
    })

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
    })

    sCrystInfo.x = 485;
    sCrystInfo.y = 345;

    tutorialScene.addChild(sCrystInfo);

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

    goblinScoreLabel = new PIXI.Text({text: "gs",
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
    }
    });

    gameOverText.x = 50;
    gameOverText.y = 30;
    gameOverScene.addChild(gameOverText);

    gameOverScoreLabel = new PIXI.Text({
        text: "",
        style: {
        fill: 0x0E6752,
        fontSize: 50,
        fontFamily: "Copperplate",
        stroke: {color: 0x98f1dc, width: 4},
    }
    });

    gameOverScoreLabel.x = 150;
    gameOverScoreLabel.y = 150;
    gameOverScene.addChild(gameOverScoreLabel);

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
    player.y = 50;

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
        let g = new Goblin(1.5);
        g.x = Math.random() * (sceneWidth-50) + 25;
        g.y = Math.random() * (sceneHeight-50) + 25;
        goblins.push(g);
        gameScene.addChild(g);
    }
}

function createCystals(num = 15){
    //normal crystals
    for(let i = 0; i < num; i++){
        let c = new Crystal(0xc2fffd);
        c.x = Math.random() * (sceneWidth-50) + 25;
        c.y = Math.random() * (sceneHeight-50) + 25;
        crystals.push(c);
        gameScene.addChild(c);
    }

    //special crystals
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
    //console.log(a.x);
    //console.log(b.x);
        let x = Math.pow((a?.x - b?.x),2);
       // console.log(x);
        let y = Math.pow((a?.y - b?.y),2);
       // console.log(y);
        let dist = x + y;
        //console.log(dist);
        let rDist = Math.pow((a?.radius + b?.radius),2);
        console.log(dist <= rDist);

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
            if(g.x <= 0 ){
                g.x = 0;
            }
            if(g.x >= sceneWidth){
                g.x = sceneWidth - 20;
            }
            if(g.y <= 0){
                g.y = 0;
            }
            if(g.y >= sceneHeight){
                g.y = sceneHeight- 20;
            }
            
        }

        //keeping the player inside the box but can move from sides to side (teleporting)

        if(player.x <= 0 ){
            player.x = sceneWidth - 1;
        }
        if(player.x >= sceneWidth){
            player.x = 0;
        }
        if(player.y <= 0){
            player.y = sceneHeight - 1;
        }
        if(player.y >= sceneHeight){
            player.y = 0;
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
                player.x = Math.random() * (sceneWidth-50) + 25;
                player.y = Math.random() * (sceneHeight-50) + 25;
            }
        }
        

        //when goblins collide with each other
        for(let g = 0; g < goblins.length; g++){
            if(goblins.length == 1 && g == (goblins.length-1)){
                break;
            }

            if(collision(goblins[g],goblins[g+1])){

                goblins[g].x = Math.random() * (sceneWidth-50) + 25;
                goblins[g].y = Math.random() * (sceneHeight-50) + 25;

                goblins[g+1].x = Math.random() * (sceneWidth-50) + 25;
                goblins[g+1].y = Math.random() * (sceneHeight-50) + 25;
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

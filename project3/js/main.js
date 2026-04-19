"use strict";

const app = new PIXI.Application();

let gamepanel = document.querySelector("#game-panel");

//all avraiables needed for the game


setup();
//async can be initialized after it's call
async function setup(){

    await app.init({width:640, height:360, background:"#222"});
    gamepanel.appendChild(app.canvas);

}
"use strict";

const app = new PIXI.Application();

let screenHeight, screenWidth;

let poly1, poly2, poly3;


setup();

async function setup(){
    await app.init({width:640, height:360, background:"#979797ff"});
    document.body.appendChild(app.canvas);


    //making shapes

    //trianglr
    poly1 = new PIXI.Graphics();
    poly1.drawPolygon([new PIXI.Point(100,100),new PIXI.Point(100,200),new PIXI.Point(200,100)]);
    poly1.fill(0xff0000);

    //rectangle
    poly2 = new PIXI.Graphics()
    .drawPolygon([new PIXI.Point(50,50),new PIXI.Point(100,50),new PIXI.Point(100,100),new PIXI.Point(50,100)]);

    //line border, width then color
    poly2.lineStyle(3,0x00ffff);

    //fill color
    poly2.beginFill(0x000000);

    //need to end the fill or it will not show up
    poly2.endFill();

    poly3 = new PIXI.Graphics()

    //order matter since each point needs to connect with each other
    .drawPolygon([new PIXI.Point(300,100),new PIXI.Point(250,130),new PIXI.Point(300,200),new PIXI.Point(350,130)]);
    poly3.fill(0xffffff);

    app.stage.addChild(poly1);
    app.stage.addChild(poly2);
    app.stage.addChild(poly3);
}
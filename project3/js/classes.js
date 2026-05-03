"use strict";
class Player extends PIXI.Sprite {
    constructor(texture,radius = 10, color = 0xfa668b, x = 0, y = 0, speed = 150) {
    super(texture);
    this.anchor.set(0.5,0.5);
    this.scale.set(0.04);
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.color = color;

    // other properties
    this.dx = 0; // per second
    this.dy = 0; // per second
    this.lives = 3;
    this.attack = false;
    }

    update(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;
    }
}

class Crystal extends PIXI.Graphics{
    constructor(color, x = 0, y = 0, width = 5, height = 10){
        super();
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.rect(x,y,width,height);
        this.fill(color);
        this.special = false;
        this.isAlive = true;
    }
}

class Goblin extends PIXI.Sprite{
    constructor(texture,speed, x = 0, y = 0, radius = 20){
        super(texture);
        this.anchor.set(0.5,0.5);
        this.scale.set(0.15);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isalive = true;

        this.isAlive = true;
        this.radius = radius;
    }



    move(pacX, pacY){
        let opposite = pacY - this.y;
        let adjacent = pacX - this.x;

        let angle = Math.atan((opposite/adjacent));

        //incase the angle is negative
        if(this.x > pacX){
            angle += 180;
        }

        let vx = this.speed * Math.cos(angle);
        let vy = this.speed * Math.sin(angle);

        this.x += vx;
        this.y += vy;

    }

    collison(a,b){
        let x = Math.pow((a.x - b.x),2);

        let y = Math.pow((a.y - b.y),2);

        let dist = x + y;

        let rDist = Math.pow((a.radius + b.radius),2);

        return dist <= rDist;
    }
}
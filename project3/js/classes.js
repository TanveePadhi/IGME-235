
class Player extends PIXI.Graphics {
    constructor(radius = 10, color = 0xfa668b, x = 0, y = 0, speed = 100) {
    super();
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.circle(0, 0, radius);
    this.fill(color);

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

class Goblin extends PIXI.Graphics{
    constructor(speed, x = 0, y = 0){
        super();
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isalive = true;
        this.circle(x,y, 20);
        this.fill(0x5bf08a);
        this.isAlive = true;
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
}
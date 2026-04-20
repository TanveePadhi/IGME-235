
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
        this.collected = false;
        this.special = false;
        this.isAlive = true;
    }
}

class Goblin extends PIXI.Graphics{
    constructor(texture,x,y,speed,color){
        super(texture);
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isalive = true;
        this.fwd = getRandomUnitVector();
        speed = 50;
    }
    move(dt = 1/60){
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }

    reflectX(){
        this.fwd.x *= -1;
    }

    reflectY(){
        this.fwd.y *= -1;
    }
}
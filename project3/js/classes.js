
class Player extends PIXI.Graphics {
  constructor(radius = 10, color = 0xff0000, x = 0, y = 0, speed = 100) {
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
    constructor(width=5, height=10, color, x, y){
        super();
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.rectangle(x,y,width,height);
        this.fill(color);
        this.collected = false;
        this.special = false;
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
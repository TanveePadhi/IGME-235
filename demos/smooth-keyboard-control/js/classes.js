class Avatar extends PIXI.Graphics {
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
  }

  update(dt) {
    this.x += this.dx * dt;
    this.y += this.dy * dt;
  }
}

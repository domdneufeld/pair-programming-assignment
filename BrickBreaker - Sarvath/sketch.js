// timer oop

let bricks, aBrick;
let setOfBricks = [];
let myballs;

function setup() {
  createCanvas(windowWidth / 2, windowHeight);
  myballs = {
    x: width / 2,
    y: height / 2,
    radius: 20,
    dx: random(3, 5),
    dy: random(3, 6),
  };
  bricks = new Brick();
  bricks.create2dArray();
}

function draw() {
  background(0);
  bricks.makeBricks();
  bricks.makeBall();
  bricks.removeBrick();
}

class Brick {
  constructor() {
    this.rows = 4;
    this.cols = 8;
    this.width = width / 8;
    this.height = height / 16;
    this.hit = false;
    this.state = 0;
  }

  makeBall() {
    ellipse(myballs.x, myballs.y, myballs.radius, myballs.radius);
    myballs.x += myballs.dx;
    myballs.y -= myballs.dy;
  }

  makeBricks() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (setOfBricks[x][y] === 1) {
          fill(255, 234, 45);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
        if (setOfBricks[x][y] === 0) {
          fill(0);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
      }
    }
  }

  create2dArray() {
    for (let x = 0; x < this.cols; x++) {
      setOfBricks.push([]);
      for (let y = 0; y < this.rows; y++) {
        setOfBricks[x].push(1);
      }
    }
    return setOfBricks;
  }

  removeBrick() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (setOfBricks[x][y].height === myballs.x + myballs.radius + myballs.dx && setOfBricks[x][y].width === myballs.y + myballs.radius + myballs.dy) {
          setOfBricks[x][y] = 0;
          this.dy = -this.dy;
        }
      }
    }
  }

}

function mousePressed() {
  let xcoord = floor(mouseX / bricks.width);
  let ycoord = floor(mouseY / bricks.height);

  if (setOfBricks[xcoord][ycoord] === 1) {
    setOfBricks[xcoord][ycoord] = 0;
  }
}

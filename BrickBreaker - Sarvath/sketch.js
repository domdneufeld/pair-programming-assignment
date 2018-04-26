// Dom's
let myPaddle;
let myBall;
let lifeCount;

// Sarvath's
let bricks, aBrick;
let setOfBricks = [];

function setup() {
  // Dom
  createCanvas(windowHeight, windowHeight);
  myPaddle = new Paddle();
  myBall = new Ball();
  lifeCount = new Lives(3);

  // Sarvath
  bricks = new Brick();
  bricks.create2dArray();
}

function draw() {
  background(100);

  myPaddle.display();
  myPaddle.move();

  myBall.display();
  myBall.move();

  lifeCount.display();
  lifeCount.removeLives();

  // Sarvath's
  bricks.makeBricks();
  bricks.removeBrick();
}

// Dom's
class Paddle {
  constructor() {
    // Display variables
    this.x = width / 2;
    this.y = height - height / 8;
    this.width = width / 8;
    this.segments = [0, 1, 2, 3, 4, 5, ];
    this.height = width / 32;
    this.segmentx = [0, 1, 2, 3, 4, 5];

    // Movement variables
    this.speed = 5;
    this.direction = 0;
    this.left = false;
    this.right = false;

    // State variable
    this.state = 0; // 0 = before serve, 1 = after serve
  }

  display() {
    fill(255);
    rectMode(CENTER);
    // Constantly checks where each segment of the paddle is
    for (let i = 0; i < this.segments.length; i++) {
      this.segmentx[i] = this.x - this.width / 2 + this.width / 6 * (i + 0.5);
    }
    // Draws the paddle
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.left && this.right) {
      this.direction = 0;
    }
    // Checks if the left arrow key is down and if the paddle is going to collide with the edge
    else if (this.left) {
      if (this.x - this.width / 2 - this.speed > 0) {
        this.direction = -1;
      }
      else {
        this.x = this.width / 2;
      }
    }
    // Checks if the right arrow key is down and if the paddle is going to collide with the edge
    else if (this.right) {
      if (this.x + this.width / 2 + this.speed < width) {
        this.direction = 1;
      }
      else {
        this.x = width - this.width / 2;
      }
    }
    else {
      this.direction = 0;
    }

    // Moves the paddle
    this.x += this.speed * this.direction;
  }

  resetPaddle() {
    this.state = 0;
    this.x = width / 2;
    this.y = height - height / 8;
  }
}

class Ball {
  constructor() {
    // Display variables
    this.x = width / 2;
    this.y = 100;
    this.radius = 25;

    // Movement variables
    this.ySpeed = 4;
    this.xSpeed = 4;
    this.xDirection = 1;
    this.yDirection = 1;
  }

  display() {
    fill(255);
    noStroke();
    ellipseMode(CENTER);
    ellipse(this.x, this.y, this.radius, this.radius);
  }

  move() {
    // Before the player serves the ball
    if (myPaddle.state === 0) {
      this.x = myPaddle.x;
      this.y = myPaddle.y - 30;
    }
    // After the player serves the ball
    else {
      // Collisions on edges
      if (this.x - this.radius / 2 + this.xDirection * this.xSpeed <= 0 || this.x + this.radius / 2 + this.xDirection * this.xSpeed >= width) {
        this.xDirection = -this.xDirection;
      }

      // Collisions on top
      if (this.y - this.radius / 2 + this.yDirection * this.ySpeed <= 0) {
        this.yDirection = -this.yDirection;
      }

      // Checks to see if the paddle is about to hit the left most segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[0] + myPaddle.width / 12 &&
        this.x + this.radius >= myPaddle.segmentx[0] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = -1;
        }
      }

      // Checks to see if the paddle is about to hit the second left most segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[1] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[1] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = -0.67;
        }
      }

      // Checks to see if the paddle is about to hit the left middle segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[2] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[2] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = -0.33;
        }
      }

      // Checks to see if the paddle is about to hit the right middle segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[3] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[3] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = 0.33;
        }
      }

      // Checks to see if the paddle is about to hit the second right most segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[4] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[4] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = 0.67;
        }
      }

      // Checks to see if the paddle is about to hit the right most segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x - this.radius <= myPaddle.segmentx[5] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[5] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = 1;
        }
      }

      // Moves the ball
      this.x += this.xDirection * this.xSpeed;
      this.y += this.yDirection * this.ySpeed;
    }
  }
}

class Timer {
  constructor(waitTime) {
    this.waitTime = waitTime;
    this.startTime = millis();
    this.finishTime = this.startTime + this.waitTime;
    this.timerIsDone = false;
  }

  reset(newWaitTime) {
    this.waitTime = newWaitTime;
    this.startTime = millis();
    this.finishTime = this.startTime + this.waitTime;
    this.timerIsDone = false;
  }

  isDone() {
    if (millis() >= this.finishTime) {
      return true;
    }
    else {
      return false;
    }
  }
}

class Lives {
  constructor(num) {
    this.lives = num;
  }

  display() {
    textSize(32);
    text("Lives: " + this.lives, 5, height - 5);
  }

  removeLives() {
    // Subtracts the amount of lives by one when the ball reaches the bottom
    if (myBall.y > height) {
      this.lives -= 1;
      myPaddle.resetPaddle();
    }
  }
}

function keyPressed() {
  // Checks to see if left arrow is pressed or if right arrow is pressed
  if (keyCode === LEFT_ARROW) {
    myPaddle.left = true;
  }

  if (keyCode === RIGHT_ARROW) {
    myPaddle.right = true;
  }

  if (keyCode === 32) {
    myPaddle.state = 1;
    myBall.xDirection = 0;
    myBall.yDirection = -1;
  }
}

function keyReleased() {
  // Checks to see if left arrow is released or if right arrow is released
  if (keyCode === LEFT_ARROW) {
    myPaddle.left = false;
  }

  if (keyCode === RIGHT_ARROW) {
    myPaddle.right = false;
  }

}

// SARVATH -------------------------------------------------------------------------------------------------------------------------------------------------
class Brick {
  constructor() {
    this.rows = 4;
    this.cols = 8;
    this.width = width / 8;
    this.height = height / 16;
    this.xPosition;
    this.yPosition;
  }

  makeBricks() {
    rectMode(CORNER);
    stroke(0);
    strokeWeight(1);
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (setOfBricks[x][y] === 1) {
          fill(255, 234, 45);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
      }
    }
  }

  removeBrick() {

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.xPosition = x * this.width;
        this.yPosition = y * this.height;
        if (setOfBricks[x][y] === 1) {
          //check if bottom hits
          if (myBall.x + myBall.radius / 4 > this.xPosition && myBall.x - myBall.radius / 4 < this.xPosition + this.width &&
            myBall.y - myBall.radius / 2 < this.yPosition + this.height && myBall.y - myBall.radius / 2 > this.yPosition) {
            setOfBricks[x][y] = 0;
            myBall.yDirection = -myBall.yDirection;
            console.log("hit");
          }
          // checks if top was hit
          if (myBall.x + myBall.radius / 4 > this.xPosition && myBall.x - myBall.radius / 4 < this.xPosition + this.width &&
            myBall.y + myBall.radius / 2 < this.yPosition + this.height && myBall.y + myBall.radius / 2 > this.yPosition) {
            setOfBricks[x][y] = 0;
            myBall.yDirection = -myBall.yDirection;
            console.log("hit");
          }
          // checks if hits right
          if (myBall.x + myBall.radius / 4 > this.xPosition && myBall.x - myBall.radius / 4 < this.xPosition + this.height &&
            myBall.y + myBall.radius / 2 < this.yPosition + this.height && myBall.y + myBall.radius / 2 > this.yPosition) {
            setOfBricks[x][y] = 0;
            myBall.xDirection = -myBall.xDirection;
            console.log("hit");
          }
          // checks if hit left
          if (myBall.x + myBall.radius / 4 > this.xPosition && myBall.x - myBall.radius / 4 < this.xPosition + this.height &&
            myBall.y + myBall.radius / 2 < this.yPosition + this.height && myBall.y + myBall.radius / 2 > this.yPosition) {
            setOfBricks[x][y] = 0;
            myBall.xDirection = -myBall.xDirection;
            console.log("hit");
          }
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


}

function mousePressed() {
  let xcoord = floor(mouseX / bricks.width);
  let ycoord = floor(mouseY / bricks.height);

  if (setOfBricks[xcoord][ycoord] === 1) {
    setOfBricks[xcoord][ycoord] = 0;
  }
}

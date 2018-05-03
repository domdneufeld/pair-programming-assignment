// Brick Breaker
// Domenic Neufeld and Sarvath Sharma
// Mr. Schellenberg - Comp Sci 30
// May 2nd, 2018
// ---------------------------------------------------------------------------------------------------------------------
// In general Dom worked on the movement of the paddle, the movement of the ball, and the collisions between
// the ball and paddle/walls. Dom also worked on some of the game play mechanics such as the score multiplier,
// the strength of bricks, hit power, the increase in speed in the ball and adding bricks.
//
// Sarvath worked on creating the 2d array of bricks, the collisions and removal of bricks and the menus and interface of the
// game. He also spent time on making a system of adding bricks at a set interval of seconds using the timer. While this wasn't
// used in our final product it was helpful in the development of the game
//
// While these were generally what each of us worked on, whenever we ran into a problem that was particularilly difficult we would
// come together and try to find a solution together. Some problems that required both of us to work on were the removal/collision
// of bricks, adding bricks to the top of our array, and the directional collisions of the paddle.

// Dom's
let myPaddle;
let myBall;
let lifeCount;
let myScore;
let myMenu;

let state = 0; // 0 = pre game menu, 1 = game, 2 = loss screen
// Sarvath's
let bricks, aBrick;
let setOfBricks = [];
let newArray;
let backgroundPic;

function preload() {
  // Sarvath
  backgroundPic = loadImage("images/logo.png");
}

function setup() {
  // Dom
  createCanvas(windowHeight, windowHeight);
  myPaddle = new Paddle();
  myBall = new Ball();
  lifeCount = new Lives(3);
  myScore = new Score();
  myMenu = new Menu();

  // Sarvath
  bricks = new Brick();
  bricks.create2dArray();
}

function draw() {
  background(100);
  if (state === 0) {
    myMenu.displayButton();
    myMenu.checkIfMouseIsOverButton();
  }

  if (state === 1) {
    myPaddle.display();
    myPaddle.move();

    myBall.display();
    myBall.move();

    lifeCount.display();
    lifeCount.removeLives();
    lifeCount.checkForLoss();

    myScore.display();

    // Sarvath's
    bricks.makeBricks();
    bricks.removeBrick();
  }

  if (state === 2) {
    myMenu.displayGameOver();
  }
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
    this.speed = 6;
    this.direction = 0;
    this.left = false;
    this.right = false;

    // State variable
    this.state = 0; // 0 = before serve, 1 = after serve

    // Counts each time the ball hits the paddle
    this.hitCount = 0;
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
    // Resets the paddle
    this.state = 0;
    this.hitCount = 0;
    this.x = width / 2;
    this.y = height - height / 8;

    // Resets the ball speed and power ups
    myBall.ySpeed = 6;
    myBall.xSpeed = 6;
    myBall.hitPower = 1;
    myScore.multiplier = 1;
  }

  hitCounter() {
    // Each time the ball hits the paddle the counter goes up
    this.hitCount += 1;
    // Every 12 hits a new row is added
    if (this.hitCount % 12 === 0) {
      bricks.addRow();
    }
    // Every 8 hits the speed of the ball increases
    if (this.hitCount % 8 === 0){
      myBall.xSpeed += 0.25;
      myBall.ySpeed += 0.25;
    }
    // Every 20 hits the amount of damage that you do to the bricks increases
    if (this.hitCount % 20 === 0){
      myBall.hitPower += 1;
    }
    // Every 24 hits the new row spawned will take one extra hit to destroy
    // This caps at 5, and doesn't reset if you lose a life
    if (this.hitCount % 24 === 0 && bricks.strength < 5){
      bricks.strength += 1;
    }
    if (this.hitCount % 50 === 0){
      myScore.multiplier += 1;
    }
  }
}

class Ball {
  constructor() {
    // Display variables
    this.x = width / 2;
    this.y = 100;
    this.radius = 25;

    // Movement variables
    this.ySpeed = 6;
    this.xSpeed = 6;
    this.xDirection = 1;
    this.yDirection = 1;

    // Power up variable
    this.hitPower = 1;

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
          myPaddle.hitCounter();
        }
      }

      // Checks to see if the paddle is about to hit the second left most segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[1] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[1] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = -0.67;
          myPaddle.hitCounter();
        }
      }

      // Checks to see if the paddle is about to hit the left middle segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[2] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[2] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = -0.33;
          myPaddle.hitCounter();
        }
      }

      // Checks to see if the paddle is about to hit the right middle segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[3] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[3] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = 0.33;
          myPaddle.hitCounter();
        }
      }

      // Checks to see if the paddle is about to hit the second right most segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x <= myPaddle.segmentx[4] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[4] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = 0.67;
          myPaddle.hitCounter();
        }
      }

      // Checks to see if the paddle is about to hit the right most segment of the paddle
      if (this.y + this.radius + this.ySpeed >= myPaddle.y && this.x - this.radius <= myPaddle.segmentx[5] + myPaddle.width / 12 &&
        this.x >= myPaddle.segmentx[5] - myPaddle.width / 12) {
        // Checks to see if ball is currently touching the section of the paddle, and makes sure it isn't hitting on the way up
        if (this.y < myPaddle.y + myPaddle.height / 2 && this.yDirection > 0) {
          this.yDirection = -this.yDirection;
          this.xDirection = 1;
          myPaddle.hitCounter();
        }
      }

      // Moves the ball
      this.x += this.xDirection * this.xSpeed;
      this.y += this.yDirection * this.ySpeed;
    }
  }
}

class Lives {
  constructor(num) {
    this.lives = num;
  }

  display() {
    // Draws life count in bottom left corner
    textSize(32);
    textAlign(LEFT, BOTTOM);
    text("Lives: " + this.lives, 5, height - 5);
  }

  removeLives() {
    // Subtracts the amount of lives by one when the ball reaches the bottom
    if (myBall.y > height) {
      this.lives -= 1;
      myPaddle.resetPaddle();
    }
  }

  checkForLoss() {
    // Changes the game to loss screen when lives reaches zero
    if (this.lives === 0) {
      state = 2;
    }
  }
}

class Score {
  constructor() {
    this.amount = 0;
    this.multiplier = 1;
  }

  display() {
    // Draws score in bottom right corner
    textAlign(LEFT, BOTTOM);
    text("Score: " + this.amount, width - 175, height - 5);
  }
}

function keyPressed() {
  // Checks to see if left arrow is pressed or if right arrow is pressed
  if (state === 1) {
    if (keyCode === LEFT_ARROW) {
      myPaddle.left = true;
    }

    if (keyCode === RIGHT_ARROW) {
      myPaddle.right = true;
    }

    // When the space bar is pressed it serves the ball
    if (keyCode === 32 && myPaddle.state === 0) {
      myPaddle.state = 1;
      myBall.xDirection = 0;
      myBall.yDirection = -1;
    }
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

function mousePressed() {
  if (state === 0 && myMenu.isMouseOverButton) {
    state = 1;
  }
}
// SARVATH -------------------------------------------------------------------------------------------------------------------------------------------------
class Menu {
  constructor() {
    this.buttonx = width / 2;
    this.buttony = height / 2;
    this.buttonWidth = width / 4;
    this.buttonHeight = width / 8;
    this.isMouseOverButton = false;
  }

  displayButton() {
    imageMode(CENTER);
    image(backgroundPic, width/2 + 50, height/2 - 200);

    rectMode(CENTER);

    fill(255);
    // Changes the color of the button from white to grey if the mouse is over it
    if (this.isMouseOverButton) {
      fill(200);
    }
    // Draws the button in the middle of the screen
    rect(this.buttonx, this.buttony, this.buttonWidth, this.buttonHeight);
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Play", this.buttonx, this.buttony);
  }

  checkIfMouseIsOverButton() {
    // Checks to see if the mouse x and y are within the button
    if (mouseX <= this.buttonx + this.buttonWidth / 2 && mouseX >= this.buttonx - this.buttonWidth / 2 &&
      mouseY <= this.buttony + this.buttonHeight / 2 && mouseY >= this.buttony - this.buttonHeight / 2) {
      this.isMouseOverButton = true;
    }
    else {
      this.isMouseOverButton = false;
    }
  }

  displayGameOver() {
    // Writes game over and your score when you lose
    fill(0, 255, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Your Score: " + myScore.amount, this.buttonx, this.buttony);

    textSize(72);
    text("Game Over", this.buttonx, this.buttony - 75);
  }
}

class Brick {
  constructor() {
    this.rows = 4;
    this.cols = 8;
    this.width = width / 8;
    this.height = height / 16;
    this.state = 0;
    this.strength = 3;
  }

  makeBricks() {
    rectMode(CORNER);
    stroke(0);
    strokeWeight(1);
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        // Draws bricks with different strengths different colours.
        if (setOfBricks[x][y] === 5) {
          fill(200, 0, 255);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
        else if (setOfBricks[x][y] === 4) {
          fill(100, 0, 200);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
        else if (setOfBricks[x][y] === 3) {
          fill(0, 0, 255);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
        else if (setOfBricks[x][y] === 2) {
          fill(0, 150, 255);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
        else if (setOfBricks[x][y] === 1) {
          fill(0, 255, 255);
          aBrick = rect(x * this.width, y * this.height, this.width, this.height);
        }
      }
    }
  }

  addRow() {
    this.rows += 1;
    newArray = [];
    for (let x = 0; x < this.cols; x++) {
      newArray.push([]);
      for (let y = 0; y < this.rows; y++) {
        if (y < 1) {
          newArray[x].push(this.strength);
        }
        else {
          newArray[x].push(setOfBricks[x][y - 1]);
        }
      }
    }
    setOfBricks = newArray;

    // Checks to see if the new row reaches the bottom
    if (this.rows >= 13){
      for (let x = 0; x < this.cols; x++){
        if (setOfBricks[x][13] > 0){
          state = 2;
        }
      }
    }
  }

  create2dArray() {
    for (let x = 0; x < this.cols; x++) {
      setOfBricks.push([]);
      for (let y = 0; y < this.rows; y++) {
        setOfBricks[x].push(this.strength);
      }
    }
    return setOfBricks;
  }

  removeBrick() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.xPosition = x * this.width;
        this.yPosition = y * this.height;
        if (setOfBricks[x][y] > 0) {
          // check if bottom hits
          if (myBall.x + myBall.radius / 2 + myBall.xSpeed * myBall.xDirection > this.xPosition &&
            myBall.x - myBall.radius / 2 + myBall.xSpeed * myBall.xDirection < this.xPosition + this.width &&
            myBall.y - myBall.radius / 2 > this.yPosition + this.height &&
            myBall.y - myBall.radius / 2 + myBall.ySpeed * myBall.yDirection <= this.yPosition + this.height && myBall.yDirection < 0) {
            setOfBricks[x][y] -= 1 * myBall.hitPower;
            myBall.yDirection = -myBall.yDirection;
            if (setOfBricks[x][y] <= 0) {
              myScore.amount += 10 * myScore.multiplier;
            }
          }

          // checks if top was hit
          else if (myBall.x + myBall.radius / 2 > this.xPosition + myBall.xSpeed * myBall.xDirection &&
            myBall.x - myBall.radius / 2 + myBall.xSpeed * myBall.xDirection < this.xPosition + this.width &&
            myBall.y + myBall.radius / 2 < this.yPosition &&
            myBall.y + myBall.radius / 2 + myBall.ySpeed * myBall.yDirection >= this.yPosition && myBall.yDirection > 0) {
            setOfBricks[x][y] -= 1 * myBall.hitPower;
            myBall.yDirection = -myBall.yDirection;
            if (setOfBricks[x][y] <= 0) {
              myScore.amount += 10 * myScore.multiplier;
            }
          }

          // checks if hits right
          else if (myBall.y + myBall.radius / 2 + myBall.ySpeed * myBall.yDirection > this.yPosition &&
            myBall.y - myBall.radius / 2 + myBall.ySpeed * myBall.yDirection < this.yPosition + this.height &&
            myBall.x - myBall.radius / 2 > this.xPosition + this.width &&
            myBall.x - myBall.radius / 2 + myBall.xSpeed * myBall.xDirection <= this.xPosition + this.width) {
            setOfBricks[x][y] -= 1 * myBall.hitPower;
            myBall.xDirection = -myBall.xDirection;
            if (setOfBricks[x][y] <= 0) {
              myScore.amount += 10 * myScore.multiplier;
            }
          }

          // checks if hit left
          else if (myBall.y + myBall.radius / 2 + myBall.ySpeed * myBall.yDirection > this.yPosition &&
            myBall.y - myBall.radius / 2 + myBall.ySpeed * myBall.yDirection < this.yPosition + this.height &&
            myBall.x + myBall.radius / 2 < this.xPosition &&
            myBall.x + myBall.radius / 2 + myBall.xSpeed * myBall.xDirection >= this.xPosition) {
            setOfBricks[x][y] -= 1 * myBall.hitPower;
            myBall.xDirection = -myBall.xDirection;
            if (setOfBricks[x][y] <= 0) {
              myScore.amount += 10 * myScore.multiplier;
            }
          }
        }
      }
    }
  }
}

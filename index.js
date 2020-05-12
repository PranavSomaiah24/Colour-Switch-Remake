let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let worldY = 0,
  gravity = 0.3;
let keyPressed;
let gameOver = true;
let colours = ["red", "yellow", "blue", "lime"];
let score = 0;

function Player() {
  this.x = canvas.width / 2;
  this.y = canvas.height - 70;
  this.colour = colours[Math.floor(Math.random() * 4)];
  this.radius = 10;
  this.vy;
  this.vx = 0;
  this.rgb;
  this.alive = true;
  this.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    if (this.alive == true) {
      if (keyPressed == "Space") {
        this.vy = -6;
        gameOver = false;
        keyPressed = "";
      }
      this.rgb = ctx.getImageData(this.x, this.y, 1, 1).data; //rgb value of player
      playerHex =
        "#" +
        ((1 << 24) + (this.rgb[0] << 16) + (this.rgb[1] << 8) + this.rgb[2])
          .toString(16)
          .slice(1);
      rgbCheckFront = ctx.getImageData(this.x, this.y - this.radius - 2, 1, 1)
        .data; //to check collision for top of circle
      frontHex =
        "#" +
        (
          (1 << 24) +
          (rgbCheckFront[0] << 16) +
          (rgbCheckFront[1] << 8) +
          rgbCheckFront[2]
        )
          .toString(16)
          .slice(1);
      rgbCheckBack = ctx.getImageData(this.x, this.y + this.radius + 2, 1, 1)
        .data; //check for bottom of player collision
      backHex =
        "#" +
        (
          (1 << 24) +
          (rgbCheckBack[0] << 16) +
          (rgbCheckBack[1] << 8) +
          rgbCheckBack[2]
        )
          .toString(16)
          .slice(1);
      if (
        frontHex == "#ff0000" ||
        frontHex == "#ffff00" ||
        frontHex == "#0000ff" ||
        frontHex == "#00ff00"
      ) {
        if (playerHex != frontHex) {
          this.alive = false;
          this.vy = -4;
          this.vx = -2;
        }
      }
      if (
        backHex == "#ff0000" ||
        backHex == "#ffff00" ||
        backHex == "#0000ff" ||
        backHex == "#00ff00"
      ) {
        if (playerHex != backHex) {
          this.alive = false;
          this.vy = -4;
          this.vx = -2;
        }
      }
    }
    if (this.y + this.radius > canvas.height) {
      this.alive = false;
      this.vy = -4;
      this.vx = -2;
    }
    if (gameOver == false) {
      if (this.y > canvas.height - 250) {
        this.y += this.vy;
        this.vy += gravity;
      } else if (this.vy < 0) {
        worldY -= this.vy;
        this.vy += gravity;
      } else {
        this.y += this.vy;
        this.vy += gravity;
      }
      this.x += this.vx;
    }
  };
}

player = new Player();

function InstructionText() {
  this.x = canvas.width / 2;
  this.y = canvas.height / 2 - 50;
  this.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y + worldY);
    ctx.font = "bold 25px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillText("Press SPACE to Jump.", 0, 0);
    ctx.restore();
  };
}
function Circle1() {
  this.angle = 0;
  this.colour1 = "red";
  this.colour2 = "blue";
  this.radius = 80;
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y + worldY);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    ctx.strokeStyle = this.colour1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.restore();
    if (this.angle >= 360) {
      this.angle = 0;
    }
    this.angle += 1;
  };
}
function Circle2() {
  this.angle1 = 0;
  this.angle2 = 0;
  this.radius = 80;
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  let vy = 0,
    vx = 0.5,
    spdx = 0;
  let dt = 0.15;
  this.draw = function () {
    // ctx.fillStyle = this.colour1;
    ctx.save();
    ctx.translate(this.x, this.y + worldY);
    ctx.rotate(-(this.angle1 * Math.PI) / 180);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.restore();
    //outer circle
    ctx.save();
    ctx.translate(this.x, this.y + worldY);
    ctx.rotate((this.angle2 * Math.PI) / 180);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 15, 0, Math.PI / 2, false);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 15, Math.PI / 2, Math.PI, false);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 15, Math.PI, (Math.PI * 3) / 2, false);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 15, (Math.PI * 3) / 2, Math.PI * 2, false);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    ctx.restore();
    if (this.angle1 >= 360) {
      this.angle1 = 0;
    }
    if (this.angle2 >= 360) {
      this.angle2 = 0;
    }
    this.angle1 += 1;
    this.angle2 += 1;
  };
}
function Circle3() {
  this.angle = 0;
  this.radius = 80;
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  let vy = 0,
    vx = 0.5,
    spdx = 0;
  let dt = 0.15;
  this.draw = function () {
    // ctx.fillStyle = this.colour1;
    ctx.save();
    ctx.translate(this.x + this.radius, this.y + worldY);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(this.x - this.radius, this.y + worldY);
    ctx.rotate(-(this.angle * Math.PI) / 180);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    ctx.strokeStyle = "lime";
    ctx.stroke();
    ctx.restore();
    if (this.angle >= 360) {
      this.angle = 0;
    }
    this.angle += 1;
  };
}
function Rect() {
  this.x = canvas.width / 2;
  this.y = 0;
  this.angle = 0;
  this.enter = false;
  this.colour1 = colours[Math.floor(Math.random() * 4)];
  this.colour2 = colours[Math.floor(Math.random() * 4)];
  this.draw = function () {
    ctx.save();
    ctx.translate(this.x + 75, this.y + worldY);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.fillStyle = this.colour1;
    ctx.fillRect(-75, -10, 150, 20);
    ctx.fillStyle = this.colour2;
    ctx.fillRect(-10, -75, 20, 150);
    ctx.restore();
    ctx.save();
    ctx.translate(this.x - 75, this.y + worldY);
    ctx.rotate(-(this.angle * Math.PI) / 180);
    ctx.fillStyle = this.colour1;
    ctx.fillRect(-75, -10, 150, 20);
    ctx.fillStyle = this.colour2;
    ctx.fillRect(-10, -75, 20, 150);
    ctx.restore();
    if (this.angle >= 360) {
      this.angle = 0;
    }
    this.angle += 1;
  };
}
function CoinSprite() {
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.collected = false;
  this.size = 32;
  this.frame = 0;
  this.frameCount = 0;
  this.img = new Image();
  this.img.src = "coin_gold.png";
  this.draw = function () {
    // if (this.collected == true) {
    //   ctx.save();
    //   console.log("yes");
    //   ctx.translate(this.x, this.y);
    //   this.x--;
    //   this.y--;
    //   if (this.x < 5 && this.y < 25) {
    // // this.size = 0;
    // score++;
    //   }
    // } else {
    ctx.save();
    ctx.translate(this.x - 17, this.y + worldY);
    // }

    ctx.beginPath();
    ctx.drawImage(
      this.img,
      this.frame * this.size,
      0,
      this.size,
      this.size,
      0,
      0,
      40,
      40
    );
    ctx.restore();
    if (this.y + worldY + 20 > player.y && this.collected == false) {
      // console.log("yup");
      this.collected = true;
      this.size = 0;
      score++;
    }

    this.frameCount++;
    if (this.frameCount >= 3) {
      if (this.frame > 7) {
        this.frame = 0;
      } else {
        this.frame++;
      }
      this.frameCount = 0;
    }
  };
}
function ColourChange() {
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.collected = false;
  this.radius = 10;
  this.size = 32;
  this.frame = 0;
  this.frameCount = 0;
  // this.img = new Image();
  // this.img.src = "coin_gold.png";
  this.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y + worldY);
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
    if (this.y + worldY + 10 > player.y && this.collected == false) {
      // console.log("yup");
      this.collected = true;
      this.radius = 0;
      player.colour = colours[Math.floor(Math.random() * 4)];
    }

    this.frameCount++;
    if (this.frameCount >= 3) {
      if (this.frame > 7) {
        this.frame = 0;
      } else {
        this.frame++;
      }
      this.frameCount = 0;
    }
  };
}
function drawScore() {
  ctx.save();
  ctx.translate(5, 25);
  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.fillText("SCORE: " + score.toString(), 0, 0);
  ctx.restore();
}
let obstacles = [],
  obstacleCount = 0,
  colourCount = 0,
  yStrt = 0,
  instruction = new InstructionText();

function addObs() {
  let randomObs = Math.floor(Math.random() * 4);
  let obs;
  switch (randomObs) {
    case 0:
      obs = new Circle2();
      break;
    case 1:
      obs = new Rect();
      break;
    case 2:
      obs = new Circle1();
      break;
    case 3:
      obs = new Circle3();
      break;
  }
  yStrt -= 300;
  if (obstacleCount > 4) {
    obs = new CoinSprite();
    obstacleCount = 0;
    yStrt += 290;
  } else if (colourCount > 6 && randomObs != 3) {
    changeColour = new ColourChange();
    obstacles.push(changeColour);
    obstacles[obstacles.length - 1].y = yStrt;
    colourCount = 0;
  }
  obstacles.push(obs);
  obstacleCount++;
  colourCount++;
  obstacles[obstacles.length - 1].y = yStrt;
}

addObs();

function gameRestart() {
  obstacles.splice(0, obstacles.length);
  player.alive = true;
  player.vx = 0;
  player.vy = 0;
  player.x = canvas.width / 2;
  player.colour = colours[Math.floor(Math.random() * 4)];
  worldY = 0;
  yStrt = 0;
  score = 0;
  addObs();
}
function animate() {
  ctx.fillRect(0, 0, 500, 700);

  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].y + worldY > 0 && obstacles[i].enter == false) {
      obstacles[i].enter = true;
      addObs();
    }
    if (obstacles[i].y + worldY > canvas.height + 150) {
      obstacles.splice(i, 1);
      // console.log(obstacles);
    }
    obstacles[i].draw();
  }

  player.draw();
  instruction.draw();
  drawScore();

  if (player.alive == false) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillText("GAME OVER-SPACE to Restart.", 0, 0);
    ctx.restore();
    if (keyPressed == "Space" && player.y > canvas.height - 50) {
      gameRestart();
    }
  }
  requestAnimationFrame(animate);
}
function keyHandle(e) {
  keyPressed = e.code;
  console.log(keyPressed);
}

animate();
window.addEventListener("keypress", keyHandle);

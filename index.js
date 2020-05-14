let canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
let ctxSingle = canvas.getContext("2d");
let worldY = 0,
  gravity = 0.3;
let keyPressed;
let gameOver = true,
  isRestart = false,
  isGravity = true;
let colours = ["red", "yellow", "blue", "lime"];
let score = 0,
  highScore;
let isPaused = false;
let clockSlow = false,
  transparent = false;

if (localStorage.getItem(highScore) == null) {
  localStorage.setItem(highScore, "0.00");
}
function Player(ctx, canvas) {
  this.x = canvas.width / 2;
  this.y = canvas.height - 70;
  this.colour = colours[Math.floor(Math.random() * 4)];
  this.radius = 10;
  this.vy;
  this.vx = 0;
  this.rgb = [];
  this.ctx = ctx;
  this.jumpKey = "Space";
  this.alive = true;
  this.init = function (x, jumpKey) {
    this.x = x;
    this.jumpKey = jumpKey;
  };
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.fillStyle = this.colour;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
    if (this.alive == true) {
      if (keyPressed == this.jumpKey && isRestart == false) {
        console.log(isRestart);
        isGravity = true;
        this.vy = -6;
        gameOver = false;
        keyPressed = "";
      }
      if (!transparent) {
        this.rgb = this.ctx.getImageData(this.x, this.y, 1, 1).data;
        //rgb value of player
        playerHex =
          "#" +
          ((1 << 24) + (this.rgb[0] << 16) + (this.rgb[1] << 8) + this.rgb[2])
            .toString(16)
            .slice(1);
        rgbCheckFront = this.ctx.getImageData(
          this.x,
          this.y - this.radius - 2,
          1,
          1
        ).data; //to check collision for top of circle
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
        rgbCheckBack = this.ctx.getImageData(
          this.x,
          this.y + this.radius + 2,
          1,
          1
        ).data; //check for bottom of player collision
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
    }
    if (this.y + this.radius > canvas.height) {
      this.alive = false;
      this.vy = -4;
      this.vx = -2;
    }
    if (gameOver == false && isGravity == true) {
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

function InstructionText(ctx, canvas) {
  this.x = canvas.width / 2;
  this.y = canvas.height / 2 - 50;
  this.ctx = ctx;
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x, this.y + worldY);
    this.ctx.font = "bold 25px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    this.ctx.fillText("Press SPACE to Jump.", 0, 0);
    this.ctx.restore();
  };
}
function Circle1(ctx, canvas) {
  this.angle = 0;
  this.colour1 = "red";
  this.colour2 = "blue";
  this.radius = 80;
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.ctx = ctx;
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x, this.y + worldY);
    this.ctx.rotate((this.angle * Math.PI) / 180);
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    this.ctx.strokeStyle = this.colour1;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    this.ctx.strokeStyle = "blue";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    this.ctx.strokeStyle = "lime";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    this.ctx.strokeStyle = "yellow";
    this.ctx.stroke();
    this.ctx.restore();
    if (this.angle >= 360) {
      this.angle = 0;
    }
    if (clockSlow == false) {
      this.angle += 1 + (score / 10) * 0.5;
    } else {
      this.angle += 0.4;
    }
  };
}
function Circle2(ctx, canvas) {
  this.angle1 = 0;
  this.angle2 = 0;
  this.radius = 80;
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.ctx = ctx;
  this.draw = function () {
    // ctx.fillStyle = this.colour1;
    this.ctx.save();
    this.ctx.translate(this.x, this.y + worldY);
    this.ctx.rotate(-(this.angle1 * Math.PI) / 180);
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    this.ctx.strokeStyle = "blue";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    this.ctx.strokeStyle = "lime";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    this.ctx.strokeStyle = "yellow";
    this.ctx.stroke();
    this.ctx.restore();
    //outer circle
    this.ctx.save();
    this.ctx.translate(this.x, this.y + worldY);
    this.ctx.rotate((this.angle2 * Math.PI) / 180);
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius + 15, 0, Math.PI / 2, false);
    this.ctx.strokeStyle = "blue";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius + 15, Math.PI / 2, Math.PI, false);
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius + 15, Math.PI, (Math.PI * 3) / 2, false);
    this.ctx.strokeStyle = "yellow";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius + 15, (Math.PI * 3) / 2, Math.PI * 2, false);
    this.ctx.strokeStyle = "lime";
    this.ctx.stroke();
    this.ctx.restore();
    if (this.angle1 >= 360) {
      this.angle1 = 0;
    }
    if (this.angle2 >= 360) {
      this.angle2 = 0;
    }
    if (clockSlow == false) {
      this.angle1 += 1 + (score / 10) * 0.5;
      this.angle2 += 1 + (score / 10) * 0.5;
    } else {
      this.angle1 += 0.4;
      this.angle2 += 0.4;
    }
  };
}
function Circle3(ctx, canvas) {
  this.angle = 0;
  this.radius = 80;
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.ctx = ctx;
  this.draw = function () {
    // ctx.fillStyle = this.colour1;
    this.ctx.save();
    this.ctx.translate(this.x + this.radius, this.y + worldY);
    this.ctx.rotate((this.angle * Math.PI) / 180);
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    this.ctx.strokeStyle = "blue";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    this.ctx.strokeStyle = "lime";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    this.ctx.strokeStyle = "yellow";
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.translate(this.x - this.radius, this.y + worldY);
    this.ctx.rotate(-(this.angle * Math.PI) / 180);
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI / 2, false);
    this.ctx.strokeStyle = "blue";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI / 2, Math.PI, false);
    this.ctx.strokeStyle = "red";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, Math.PI, (Math.PI * 3) / 2, false);
    this.ctx.strokeStyle = "yellow";
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, (Math.PI * 3) / 2, Math.PI * 2, false);
    this.ctx.strokeStyle = "lime";
    this.ctx.stroke();
    this.ctx.restore();
    if (this.angle >= 360) {
      this.angle = 0;
    }
    if (clockSlow == false) {
      this.angle += 1 + (score / 10) * 0.5;
    } else {
      this.angle += 0.4;
    }
  };
}
function Rect(ctx, canvas) {
  this.x = canvas.width / 2;
  this.y = 0;
  this.angle = 0;
  this.enter = false;
  this.ctx = ctx;
  this.colour1 = colours[Math.floor(Math.random() * 4)];
  this.colour2 = colours[Math.floor(Math.random() * 4)];
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x + 75, this.y + worldY);
    this.ctx.rotate((this.angle * Math.PI) / 180);
    this.ctx.fillStyle = this.colour1;
    this.ctx.fillRect(-75, -10, 150, 20);
    this.ctx.fillStyle = this.colour2;
    this.ctx.fillRect(-10, -75, 20, 150);
    this.ctx.restore();
    this.ctx.save();
    this.ctx.translate(this.x - 75, this.y + worldY);
    this.ctx.rotate(-(this.angle * Math.PI) / 180);
    this, (ctx.fillStyle = this.colour1);
    this, ctx.fillRect(-75, -10, 150, 20);
    this.ctx.fillStyle = this.colour2;
    this.ctx.fillRect(-10, -75, 20, 150);
    this.ctx.restore();
    if (this.angle >= 360) {
      this.angle = 0;
    }
    if (clockSlow == false) {
      this.angle += 1 + (score / 10) * 0.5;
    } else {
      this.angle += 0.4;
    }
  };
}

function RectMoving(ctx, canvas) {
  this.x = 75;
  this.y = 0;
  this.angle = 0;
  this.enter = false;
  this.ctx = ctx;
  this.colour1 = colours[Math.floor(Math.random() * 4)];
  this.colour2 = colours[Math.floor(Math.random() * 4)];
  this.vx = 2 + (score / 10) * 0.5;
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x, this.y + worldY);
    this.ctx.rotate((this.angle * Math.PI) / 180);
    this.ctx.fillStyle = this.colour1;
    this.ctx.fillRect(-75, -10, 150, 20);
    this.ctx.fillStyle = this.colour2;
    this.ctx.fillRect(-10, -75, 20, 150);
    this.ctx.restore();

    if (this.angle >= 360) {
      this.angle = 0;
    }
    if (this.x + 75 > canvas.width || this.x - 75 < 0) {
      this.vx *= -1;
    }
    if (clockSlow == false) {
      this.angle += 1 + (score / 10) * 0.5;
    } else {
      this.angle += 0.4;
    }
    if (this.vx != 1 && this.vx != -1 && clockSlow == false) {
      if (this.vx > 0) {
        this.vx = 1;
      } else {
        this.vx = -1;
      }
    }
    this.x += this.vx;
  };
}

function CoinSprite(ctx, player) {
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.collected = false;
  this.size = 32;
  this.frame = 0;
  this.frameCount = 0;
  this.img = new Image();
  this.ctx = ctx;
  this.img.src = "coin_gold.png";
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x - 17, this.y + worldY);
    this.ctx.beginPath();
    this.ctx.drawImage(
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
    this.ctx.restore();
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
function ClockSprite(ctx, player) {
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.collected = false;
  this.size = 290;
  this.frame = 0;
  this.row = 0;
  this.ctx = ctx;
  this.frameCount = 0;
  this.img = new Image();
  this.img.src = "clock_animation.png";
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x - 20, this.y + worldY);
    this.ctx.beginPath();
    this.ctx.drawImage(
      this.img,
      this.frame * this.size,
      this.row * this.size,
      this.size,
      this.size,
      0,
      0,
      50,
      50
    );
    this.ctx.restore();
    if (this.y + worldY + 20 > player.y && this.collected == false) {
      this.collected = true;
      this.size = 0;
      clockSlow = true;
    }

    this.frameCount++;
    if (this.frameCount >= 10) {
      if (this.frame > 5) {
        this.frame = 0;
        if (this.row == 0) {
          this.row = 1;
        } else {
          this.row = 0;
        }
      } else {
        this.frame++;
      }
      this.frameCount = 0;
    }
  };
}
function TransparentBall(ctx, player) {
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.collected = false;
  this.radius = 13;
  this.ctx = ctx;
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x, this.y + worldY);
    this.ctx.fillStyle = "rgba(255,255,255,0.2)";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.restore();
    if (this.y + worldY + 10 > player.y && this.collected == false) {
      this.collected = true;
      transparent = true;
      this.radius = 0;
      player.colour = "rgba(255,255,255,0.2)";
    }
  };
}
function ColourChange(ctx, player) {
  this.x = canvas.width / 2;
  this.y = 0;
  this.enter = false;
  this.collected = false;
  this.radius = 10;
  this.ctx = ctx;
  this.draw = function () {
    this.ctx.save();
    this.ctx.translate(this.x, this.y + worldY);
    this.ctx.fillStyle = "pink";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.restore();
    if (
      this.y + worldY + 10 > player.y &&
      this.collected == false &&
      transparent == false
    ) {
      // console.log("yup");
      this.collected = true;
      this.radius = 0;
      player.colour = colours[Math.floor(Math.random() * 4)];
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
function drawHighScore() {
  ctx.save();
  ctx.translate(370, 25);
  ctx.font = "bold 15px Arial";
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.fillText("HIGHSCORE: " + localStorage.getItem(highScore), 0, 0);
  ctx.restore();
}
function checkHighScore() {
  let high;
  if (
    Number(localStorage.getItem(highScore)) < score ||
    Number(localStorage.getItem(highScore)) == 0.0
  ) {
    high = score;
    localStorage.setItem(highScore, high.toString());
  }
}
let obstaclesSingle = [],
  obstacleCount = 0,
  colourCount = 0,
  transparentCount = 0,
  totalCount = 0,
  totalCount2 = 0,
  clockCount = 0;
(yStrt = 0), (instruction = new InstructionText(ctx, canvas));

function addObs(obstacles, ctx, player) {
  let randomObs = Math.floor(Math.random() * 5);
  let obs;
  switch (randomObs) {
    case 0:
      obs = new Circle2(ctx, canvas);
      break;
    case 1:
      obs = new Rect(ctx, canvas);
      break;
    case 2:
      obs = new Circle1(ctx, canvas);
      break;
    case 3:
      obs = new Circle3(ctx, canvas);
      break;
    case 4:
      obs = new RectMoving(ctx, canvas);
      break;
  }
  yStrt -= 300;
  if (obstacleCount > 1) {
    obs = new CoinSprite(ctx, player);
    obstacleCount = 0;
    yStrt += 290;
    obstacleCount--;
  } else if (colourCount > 6 && randomObs != 3) {
    changeColour = new ColourChange(ctx, player);
    obstacles.push(changeColour);
    obstacles[obstacles.length - 1].y = yStrt;
    colourCount = 0;
  } else if (clockCount >= 8) {
    obs = new ClockSprite(ctx, player);
    yStrt += 300;
    totalCount = clockCount;
    clockCount = 0;
  } else if (transparentCount > 14 && randomObs != 3) {
    trans = new TransparentBall(ctx, player);
    obstacles.push(trans);
    obstacles[obstacles.length - 1].y = yStrt;
    totalCount2 = transparentCount;
    transparentCount = 0;
  }

  if (totalCount >= 13) {
    clockSlow = false;
  }
  if (totalCount2 > 21) {
    player.colour = colours[Math.floor(Math.random() * 4)];
    transparent = 0;
    transparent = false;
  }
  obstacles.push(obs);
  obstacleCount++;
  if (clockSlow == false) {
    clockCount++;
  } else {
    totalCount++;
  }
  if (transparent == false) {
    transparentCount++;
  } else {
    totalCount2++;
  }
  colourCount++;
  obstacles[obstacles.length - 1].y = yStrt;
}

function gameRestart(playerObject, obstacles, ctx, canvas) {
  obstacles.splice(0, obstacles.length);
  playerObject.alive = true;
  playerObject.vx = 0;
  playerObject.vy = 0;
  playerObject.x = canvas.width / 2;
  playerObject.y = canvas.height - 70;
  playerObject.colour = colours[Math.floor(Math.random() * 4)];
  clockSlow = false;
  worldY = 0;
  yStrt = 0;
  score = 0;
  obstacleCount = 0;
  totalCount = 0;
  clockCount = 0;
  colourCount = 0;
  transparentCount = 0;
  obsCtx = ctx;
  transparent = false;
  keyPressed = "";
  addObs(obstacles, obsCtx, playerObject, canvas);
}

function keyHandle(e) {
  keyPressed = e.code;
}

window.addEventListener("keypress", keyHandle);
let btnSingle = document.getElementById("single"),
  btnSplit = document.getElementById("split");
let animationID;

btnSingle.addEventListener("click", () => {
  isPaused = false;
  document.getElementById("buttons").style.display = "none";
  canvas.style.left = "30%";
  canvas.style.display = "block";
  document.getElementById("playBtn").style.display = "block";
  document.getElementById("pauseBtn").style.display = "block";
  document.getElementById("menuBtn").style.display = "block";
  player = new Player(ctx, canvas);
  addObs(obstaclesSingle, ctx, player, canvas);
  function animate() {
    if (!isPaused) {
      ctx.fillRect(0, 0, 500, 700);
    }
    for (let i = 0; i < obstaclesSingle.length; i++) {
      if (
        obstaclesSingle[i].y + worldY > 0 &&
        obstaclesSingle[i].enter == false
      ) {
        obstaclesSingle[i].enter = true;
        addObs(obstaclesSingle, ctx, player, canvas);
      }
      if (obstaclesSingle[i].y + worldY > canvas.height + 150) {
        obstaclesSingle.splice(i, 1);
      }
      if (!isPaused) {
        obstaclesSingle[i].draw();
      }
    }
    if (!isPaused) {
      player.draw();
      instruction.draw();
      drawScore();
      checkHighScore();
      drawHighScore();
    }
    if (player.alive == false) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.fillText("GAME OVER-SPACE TO RESTART.", 0, 0);
      ctx.restore();
      isRestart = true;
      if (keyPressed == player.jumpKey && player.y > canvas.height - 50) {
        isGravity = false;
        gameRestart(player, obstaclesSingle, ctx, canvas);
        isRestart = false;
      }
    }
    animationID = requestAnimationFrame(animate);
  }
  animate();
});

let btnPlay = document.getElementById("playBtn"),
  btnPause = document.getElementById("pauseBtn");
let btnMenu = document.getElementById("menuBtn");

btnPlay.addEventListener("click", () => {
  isPaused = false;
});
btnPause.addEventListener("click", () => {
  isPaused = true;
});
btnMenu.addEventListener("click", () => {
  player.alive = false;
  cancelAnimationFrame(animationID);

  isPaused = true;
  document.getElementById("playBtn").style.display = "none";
  document.getElementById("pauseBtn").style.display = "none";
  document.getElementById("menuBtn").style.display = "none";
  canvas.style.display = "none";
  document.getElementById("buttons").style.display = "block";
});

// btnSplit.addEventListener("click", () => {
//   worldY1 = 0;
//   (worldY2 = 0), (document.getElementById("buttons").style.display = "none");
//   let canvas = document.getElementById("myCanvas");
//   let ctx1 = canvas.getContext("2d");
//   canvas.style.left = "0%";
//   canvas.style.display = "block";
//   let canvas2 = document.getElementById("myCanvas2");
//   let ctx2 = canvas2.getContext("2d");
//   canvas2.style.left = "60%";
//   canvas2.style.display = "block";
//   player1 = new Player(ctx1, canvas);
//   player2 = new Player(ctx2, canvas2);
//   // player2.init(canvas2.width / 2, "Enter");
//   let obstacles1 = [],
//     obstacles2 = [];
//   addObs(obstacles1, ctx1, player1, canvas);
//   function animate() {
//     ctx1.fillRect(0, 0, 500, 700);

//     for (let i = 0; i < obstacles1.length; i++) {
//       if (obstacles1[i].y + worldY > 0 && obstacles1[i].enter == false) {
//         obstacles1[i].enter = true;
//         addObs(obstacles1, ctx1, player1, canvas);
//       }
//       if (obstacles1[i].y + worldY > canvas.height + 150) {
//         obstacles1.splice(i, 1);
//       }

//       obstacles1[i].draw();
//     }

//     player1.draw();
//     // instruction.draw();
//     // drawScore();

//     if (player1.alive == false) {
//       ctx1.save();
//       ctx1.translate(canvas.width / 2, canvas.height / 2);
//       ctx1.font = "bold 30px Arial";
//       ctx1.textAlign = "center";
//       ctx1.fillStyle = "white";
//       ctx1.beginPath();
//       ctx1.fillText("GAME OVER-SPACE to Restart.", 0, 0);
//       ctx1.restore();
//       if (keyPressed == player1.jumpKey && player1.y > canvas.height - 50) {
//         gameRestart(player1, obstacles1, ctx1, canvas);
//       }
//     }
//     requestAnimationFrame(animate);
//   }
//   function animate2() {
//     ctx2.fillRect(0, 0, 500, 700);
//     for (let i = 0; i < obstacles2.length; i++) {
//       if (obstacles2[i].y + worldY > 0 && obstacles2[i].enter == false) {
//         obstacles2[i].enter = true;
//         addObs(obstacles2, ctx2, player2, canvas2);
//       }
//       if (obstacles2[i].y + worldY > canvas2.height + 150) {
//         obstacles2.splice(i, 1);
//       }

//       obstacles2[i].draw();
//     }

//     player2.draw();
//     // instruction.draw();
//     // drawScore();

//     if (player2.alive == false) {
//       ctx2.save();
//       ctx2.translate(canvas.width / 2, canvas.height / 2);
//       ctx2.font = "bold 30px Arial";
//       ctx2.textAlign = "center";
//       ctx2.fillStyle = "white";
//       ctx2.beginPath();
//       ctx2.fillText("GAME OVER-SPACE to Restart.", 0, 0);
//       ctx2.restore();
//       if (keyPressed == player2.jumpKey && player2.y > canvas2.height - 50) {
//         gameRestart(player2, obstacles2, ctx2, canvas2);
//       }
//     }
//     requestAnimationFrame(animate2);
//   }
//   animate();
//   animate2();
// });

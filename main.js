let uni;
let obst;
let myObstacles = [];
let score;
let play = document.getElementById('play');

function startGame() {
  uni = new makeUnicorn(70, 70, 0, 100, "unicorn");
  score = new component('30px', 'Consolas', 'white', 700, 30, 'text');
  myGameArea.start();

}

var myGameArea = {
  canvas: document.createElement('canvas'),
  start: function() {
    this.canvas.width = 1080;
    this.canvas.height = 450;
    let background = "background.jpg"
    this.canvas.style.background = `url(${background})`;
    //this.canvas.style.background = '#000';
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function(e) {
      myGameArea.key = e.keyCode;

    });
    window.addEventListener('keyup', function(e) {
      myGameArea.key = false;
    })
    play.addEventListener('click', function() {
      document.location.href = ""
    });

  },
  stop: function() {
    clearInterval(this.interval);


  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },




}

function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    if (this.type == 'text') {
      ctx.font = this.width + ' ' + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else if (this.type == "rainbow") {
      let gradient = ctx.createLinearGradient(this.x, 0, 20, 170);
      gradient.addColorStop(0, 'red');
      gradient.addColorStop(0.25, 'orange');
      gradient.addColorStop(0.5, 'yellow');
      gradient.addColorStop(0.75, 'green');
      gradient.addColorStop(1, 'purple');

      ctx.fillStyle = gradient;
      ctx.fillRect(this.x, this.y, this.width, this.height)
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

function makeUnicorn(width, height, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.gravity = 0.05;
  this.gravitySpeed = 0;
  this.update = function() {
    if (this.type == "star") {
      let star = new Image();
      star.src = 'star3.jpg';
      ctx = myGameArea.context;
      ctx.drawImage(star, this.x, this.y, this.width, this.height)
    } else {
      let unicorn = new Image();
      unicorn.src = 'unicorn.png';
      ctx = myGameArea.context;
      ctx.drawImage(unicorn, this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {

    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += (this.speedY + this.gravitySpeed) * Math.cos(30);
    this.hitBottom();
    this.hitTop();

  }
  this.crashWith = function(otherObj) {
    let myLeft = this.x;
    let myRight = this.x + (this.width);
    let myTop = this.y;
    let myBottom = this.y + (this.height);
    let otherLeft = otherObj.x;
    let otherRight = otherObj.x + (otherObj.width);
    let otherTop = otherObj.y;
    let otherBottom = otherObj.y + (otherObj.height);
    let crash = true;
    if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
      crash = false;
    }
    return crash
  }
  this.hitTop = function() {
    var topHeight = 0;
    if (this.y + 5 < topHeight) {
      this.y = topHeight;
      myGameArea.stop();

    }
  }
  this.hitBottom = function() {
    var rockBottom = 370;
    if (this.y > rockBottom) {
      this.y = rockBottom;
      this.gravitySpeed = 0;
    }
  }

}




function makeTerrain() {
  let ctx = myGameArea.context;
  ctx.fillStyle = "yellow"
  ctx.fillRect(0, 430, myGameArea.canvas.width, 20);

}

function everyInterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function jump(n) {
  uni.gravity = n;
}

function updateGameArea() {

  for (i = 0; i < myObstacles.length; i += 1) {
    if (uni.crashWith(myObstacles[i])) {
      myGameArea.stop();
      return;
    }
  }

  var x, height, minHeight, maxHeight;
  myGameArea.clear();


  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyInterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 250;
    maxHeight = 350;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    let maxStarHeight = 150;
    let minStarHeight = 50;
    let starHeight = Math.floor(Math.random() * (maxStarHeight - minStarHeight + 1) + minStarHeight);
    let starX = Math.floor(Math.random() * (1080 - 600 + 1) + 600);

    myObstacles.push(new component(10, x - height, '', x, height, 'rainbow'));

    if (myGameArea.frameNo >= 200) {
      myObstacles.push(new makeUnicorn(25, 25, starX, starHeight, "star"));
    }
  }
  for (i = 0; i < myObstacles.length; i += 1) {

    if (myGameArea.frameNo >= 2000) {
      myObstacles[i].x += -8;
      myObstacles[i].update();
    } else {
      myObstacles[i].x += -6;
      myObstacles[i].update();
    }
  }

  if (myGameArea.key && myGameArea.key == 32) {
    jump(-3);
  } else {
    jump(1.2);
  }


  score.text = "DIAMONDS: " + myGameArea.frameNo;
  score.update();
  makeTerrain();
  uni.newPos();
  uni.update();
}
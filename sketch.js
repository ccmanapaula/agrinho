let tracks = [150, 250, 350]; // trilhos
let train;
let items = [];
let obstacles = [];
let score = 0;
let speed = 3;
let gameState = "menu";

function setup() {
  createCanvas(600, 400);
  train = new Train();
  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  background(220);

  if (gameState === "menu") {
    showMenu();
  } else if (gameState === "play") {
    playGame();
  } else if (gameState === "end") {
    showGameOver();
  }
}

function showMenu() {
  fill(0);
  textSize(32);
  text("Expresso da União", width / 2, height / 2 - 40);
  textSize(18);
  text("Clique para começar", width / 2, height / 2);
}

function playGame() {
  drawTracks();
  train.display();

  // Atualizar e exibir itens
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].update();
    items[i].display();

    if (items[i].hits(train)) {
      score++;
      items.splice(i, 1);
    } else if (items[i].offscreen()) {
      items.splice(i, 1);
    }
  }

  // Obstáculos
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].display();

    if (obstacles[i].hits(train)) {
      gameState = "end";
    } else if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }
  }

  // Adiciona itens e obstáculos
  if (frameCount % 60 === 0) {
    if (random(1) < 0.6) {
      items.push(new Item());
    } else {
      obstacles.push(new Obstacle());
    }
  }

  // HUD
  fill(0);
  textSize(18);
  text(`Pontuação: ${score}`, 70, 20);
  text(`Velocidade: ${speed.toFixed(1)}`, width - 100, 20);

  // Aumenta a dificuldade
  if (frameCount % 300 === 0) {
    speed += 0.2;
  }
}

function drawTracks() {
  stroke(180);
  for (let y of tracks) {
    line(0, y, width, y);
  }
  noStroke();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    train.move(-1);
  } else if (keyCode === RIGHT_ARROW) {
    train.move(1);
  }
}

function mousePressed() {
  if (gameState === "menu" || gameState === "end") {
    gameState = "play";
    score = 0;
    speed = 3;
    train = new Train();
    items = [];
    obstacles = [];
  }
}

// CLASSES

class Train {
  constructor() {
    this.trackIndex = 1;
    this.x = 50;
  }

  getY() {
    return tracks[this.trackIndex];
  }

  move(dir) {
    this.trackIndex = constrain(this.trackIndex + dir, 0, tracks.length - 1);
  }

  display() {
    fill(100, 50, 200);
    rect(this.x, this.getY() - 20, 60, 40);
    fill(255);
    text("🚂", this.x + 30, this.getY());
  }
}

class Item {
  constructor() {
    this.track = int(random(tracks.length));
    this.y = tracks[this.track];
    this.x = width;
    this.size = 30;
    this.type = random(["Campo", "Cidade"]);
  }

  update() {
    this.x -= speed;
  }

  display() {
    fill(this.type === "Campo" ? "green" : "blue");
    ellipse(this.x, this.y, this.size);
    fill(255);
    textSize(12);
    text(this.type, this.x, this.y);
  }

  hits(train) {
    return dist(this.x, this.y, train.x + 30, train.getY()) < this.size / 2 + 30;
  }

  offscreen() {
    return this.x < -this.size;
  }
}

class Obstacle {
  constructor() {
    this.track = int(random(tracks.length));
    this.y = tracks[this.track];
    this.x = width;
    this.size = 40;
    this.type = random(["Pedra", "Carro", "Boi"]);
  }

  update() {
    this.x -= speed;
  }

  display() {
    fill(150, 0, 0);
    rect(this.x, this.y - 20, this.size, this.size);
    fill(255);
    textSize(12);
    text(this.type, this.x + this.size / 2, this.y);
  }

  hits(train) {
    return dist(this.x + this.size / 2, this.y, train.x + 30, train.getY()) < this.size / 2 + 30;
  }

  offscreen() {
    return this.x < -this.size;
  }
}

function showGameOver() {
  background(50);
  fill(255);
  textSize(32);
  text("Fim de Jogo!", width / 2, height / 2 - 40);
  textSize(20);
  text(`Pontuação final: ${score}`, width / 2, height / 2);
  text("Clique para jogar novamente", width / 2, height / 2 + 40);
}

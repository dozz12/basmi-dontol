const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Load Images
const imgAdit = new Image();
imgAdit.src = 'assets/adit.jpg';

const imgDenis = new Image();
imgDenis.src = 'assets/denis.jpg';

// Game objects
let adit = { x: 50, y: 180, width: 50, height: 50, hp: 100 };
let bullets = [];
let enemies = [];
let keys = {};
let score = 0;

// Enemy spawn
function spawnEnemy() {
  enemies.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 50),
    width: 50,
    height: 50,
    speed: 2 + Math.random() * 2
  });
}

setInterval(spawnEnemy, 2000);

// Keyboard control
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Mobile button controls
document.getElementById('btnUp').addEventListener('touchstart', () => keys['ArrowUp'] = true);
document.getElementById('btnUp').addEventListener('touchend', () => keys['ArrowUp'] = false);

document.getElementById('btnDown').addEventListener('touchstart', () => keys['ArrowDown'] = true);
document.getElementById('btnDown').addEventListener('touchend', () => keys['ArrowDown'] = false);

document.getElementById('btnShoot').addEventListener('touchstart', () => keys[' '] = true);
document.getElementById('btnShoot').addEventListener('touchend', () => keys[' '] = false);

function update() {
  // Movement
  if (keys['w'] || keys['ArrowUp']) adit.y -= 5;
  if (keys['s'] || keys['ArrowDown']) adit.y += 5;

  // Shooting
  if (keys[' '] && (bullets.length === 0 || Date.now() - bullets[bullets.length - 1].time > 300)) {
    bullets.push({
      x: adit.x + adit.width,
      y: adit.y + 20,
      width: 10,
      height: 5,
      speed: 7,
      time: Date.now()
    });
  }

  // Bullet update
  bullets.forEach(b => b.x += b.speed);
  bullets = bullets.filter(b => b.x < canvas.width);

  // Enemy update
  enemies.forEach(e => e.x -= e.speed);

  // Bullet-enemy collision
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x &&
          b.y < e.y + e.height && b.y + b.height > e.y) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score++;
      }
    });
  });

  // Enemy-player collision
  enemies.forEach((e, ei) => {
    if (e.x < adit.x + adit.width && e.x + e.width > adit.x &&
        e.y < adit.y + adit.height && e.y + e.height > adit.y) {
      enemies.splice(ei, 1);
      adit.hp -= 10;
      document.getElementById('hpFill').style.width = adit.hp + "%";
    }
  });

  // Game over
  if (adit.hp <= 0) {
    alert("Game Over! Skor kamu: " + score);
    document.location.reload();
  }
}

function draw() {
  // Ganti background menjadi putih
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Adit
  ctx.drawImage(imgAdit, adit.x, adit.y, adit.width, adit.height);

  // Draw bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  // Draw enemies (Denis)
  enemies.forEach(e => {
    ctx.drawImage(imgDenis, e.x, e.y, e.width, e.height);
  });

  // Score
  ctx.fillStyle = "black";  // Ubah warna tulisan menjadi hitam supaya kelihatan jelas
  ctx.font = "16px sans-serif";
  ctx.fillText("Skor: " + score, 700, 20);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

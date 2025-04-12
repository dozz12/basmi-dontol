const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Load Images
const imgAdit = new Image();
imgAdit.src = 'assets/adit.jpg';  // Adit lebih besar

const imgDenis = new Image();
imgDenis.src = 'assets/denis.jpg';  // Denis lebih besar

// Game objects
let adit = { x: 50, y: 180, width: 150, height: 150, hp: 100 };  // Ukuran Adit lebih besar
let bullets = [];
let enemies = [];
let keys = {};
let score = 0;

// Enemy spawn
function spawnEnemy() {
  enemies.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 150),
    width: 150,  // Ukuran Denis lebih besar
    height: 150, // Ukuran Denis lebih besar
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

// Wait for user interaction to start background music
document.addEventListener('click', function() {
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.play();  // Play background music after user click
});

function update() {
  // Movement
  if (keys['w'] || keys['ArrowUp']) adit.y -= 5;
  if (keys['s'] || keys['ArrowDown']) adit.y += 5;

  // Shooting
  if (keys[' '] && (bullets.length === 0 || Date.now() - bullets[bullets.length - 1].time > 300)) {
    bullets.push({
      x: adit.x + adit.width,
      y: adit.y + 40,
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
        // Mainkan suara Denis terkena tembakan
        const denisSound = new Audio('assets/bg-music.mp3');
        denisSound.play();
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
      // Mainkan suara Denis menyerang Adit
      const denisSound = new Audio('assets/bg-music.mp3');
      denisSound.play();
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

  // Draw Adit (lebih besar)
  ctx.drawImage(imgAdit, adit.x, adit.y, adit.width, adit.height);

  // Draw bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  // Draw enemies (Denis, lebih besar)
  enemies.forEach(e => {
    ctx.drawImage(imgDenis, e.x, e.y, e.width, e.height);
  });

  // Score
  ctx.fillStyle = "black";  
  ctx.font = "16px sans-serif";
  ctx.fillText("Skor: " + score, 700, 20);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

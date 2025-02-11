const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const progressElement = document.getElementById("progress");
const loadingElement = document.getElementById("loading"); // Lấy phần tử loading

// Cài đặt kích thước canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Biến điều khiển
let heartSize = 50;
let growing = true;
let isExploded = false;
const smallHearts = [];
const heartColor = "rgba(255, 0, 0, 0.7)";
let loadingProgress = 0; // Biến để theo dõi tiến trình loading

// Hàm vẽ trái tim
function drawHeart(x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, size / 10);
  ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 2, 0, size);
  ctx.bezierCurveTo(size, size / 2, size / 2, -size / 2, 0, size / 10);
  ctx.fillStyle = heartColor;
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

// Hàm cập nhật animation
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isExploded) {
    drawHeart(canvas.width / 2, canvas.height / 2, heartSize);

    if (growing) {
      heartSize += 1;
      if (heartSize > 70) growing = false;
    } else {
      heartSize -= 1;
      if (heartSize < 50) growing = true;
    }

    // Cập nhật thanh loading
    loadingProgress += 1; // Tăng tiến trình
    if (loadingProgress > 100) {
      loadingProgress = 100; // Giới hạn tiến trình ở 100
      triggerExplosion(); // Gọi hàm nổ khi loading hoàn tất
    }
    progressElement.style.width = loadingProgress + "%"; // Cập nhật chiều rộng của thanh loading
  }

  for (let i = smallHearts.length - 1; i >= 0; i--) {
    const heart = smallHearts[i];
    heart.y -= heart.speed;
    heart.x += heart.drift;
    drawHeart(heart.x, heart.y, heart.size);

    if (heart.y < -heart.size) {
      smallHearts.splice(i, 1);
    }
  }

  // Kiểm tra nếu không còn trái tim nào
  if (isExploded && smallHearts.length === 0) {
    redirectToNewURL(); // Gọi hàm chuyển hướng
  }

  requestAnimationFrame(update);
}

// Hàm nổ
function triggerExplosion() {
  isExploded = true;
  loadingElement.style.display = "none"; // Ẩn thanh loading

  for (let i = 0; i < 30; i++) {
    smallHearts.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 1.5,
    });
  }
}

// Hàm chuyển hướng đến URL mới
function redirectToNewURL() {
  window.location.href = "./page_2.html"; // Thay đổi URL này thành URL bạn muốn chuyển hướng đến
}

// Bắt đầu animation
requestAnimationFrame(update);

const canvas = document.getElementById('tesseractCanvas');
const ctx = canvas.getContext('2d');
const twoPi = Math.PI * 2;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const tesseract = {
  vertices: [
    [-1, -1, -1, -1],
    [-1, -1, -1, 1],
    [-1, -1, 1, -1],
    [-1, -1, 1, 1],
    [-1, 1, -1, -1],
    [-1, 1, -1, 1],
    [-1, 1, 1, -1],
    [-1, 1, 1, 1],
    [1, -1, -1, -1],
    [1, -1, -1, 1],
    [1, -1, 1, -1],
    [1, -1, 1, 1],
    [1, 1, -1, -1],
    [1, 1, -1, 1],
    [1, 1, 1, -1],
    [1, 1, 1, 1],
  ],
  edges: [
    [0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
    [8, 9], [9, 11], [11, 10], [10, 8],
    [12, 13], [13, 15], [15, 14], [14, 12],
    [8, 12], [9, 13], [10, 14], [11, 15],
    [0, 8], [1, 9], [2, 10], [3, 11],
    [4, 12], [5, 13], [6, 14], [7, 15],
  ],
  angleX: 0.005,
  angleY: 0.005,
};

function project(point) {
  const scale = 400; // Adjust this value for the desired size
  const distance = 4;

  const x = point[0] / (distance - point[2]);
  const y = point[1] / (distance - point[3]);

  return [x * scale + canvas.width / 2, y * scale + canvas.height / 2];
}

function drawStar() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const size = Math.random() * 3;

  ctx.beginPath();
  ctx.arc(x, y, size, 0, twoPi);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw stars in the background
  for (let i = 0; i < 50; i++) {
    drawStar();
  }

  tesseract.vertices.forEach((vertex) => {
    const [x, y] = project(vertex);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, twoPi);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  });

  ctx.beginPath();
  tesseract.edges.forEach(([start, end]) => {
    const [x1, y1] = project(tesseract.vertices[start]);
    const [x2, y2] = project(tesseract.vertices[end]);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  });
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.closePath();

  // Rotate the tesseract
  tesseract.vertices.forEach((vertex) => {
    const [x, y, z, w] = vertex;

    // Rotate around X-axis
    const newY = y * Math.cos(tesseract.angleX) - z * Math.sin(tesseract.angleX);
    const newZ = y * Math.sin(tesseract.angleX) + z * Math.cos(tesseract.angleX);

    // Rotate around Y-axis
    const newX = x * Math.cos(tesseract.angleY) + w * Math.sin(tesseract.angleY);
    const newW = -x * Math.sin(tesseract.angleY) + w * Math.cos(tesseract.angleY);

    vertex[0] = newX;
    vertex[1] = newY;
    vertex[2] = newZ;
    vertex[3] = newW;
  });

  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
  // Update canvas size on window resize
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

draw();

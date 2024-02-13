var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var toolSelect = document.getElementById("tool");
var w=$(window).width();
var h=$(window).height();

var canvasRect = canvas.getBoundingClientRect(); // Mendapatkan posisi dan ukuran aktual canvas di layar
canvas.width = canvasRect.width; 
// canvas.width = w;

document.getElementById("draw").style.cursor = "crosshair";
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, w, h);

// initialize position as 0,0
var pos = { x: 0, y: 0 };
var isDrawing = false;

// new position from mouse events
function setPosition(e) {
  // pos.x = e.clientX;
  // pos.y = e.clientY;
  pos.x = e.clientX - canvasRect.left;
  pos.y = e.clientY - canvasRect.top;
}

function draw(e) {
  if (!isDrawing) return;

  var color = (toolSelect.value === 'brush') ? '#FFF' : '#000'; // Hitam untuk kuas, putih untuk penghapus
  var line = (toolSelect.value === 'brush') ? 10 : 20; // Lebar garis yang berbeda untuk kuas dan penghapus

  if (e.buttons !== 1) return; // if mouse is not clicked, do not go further
  ctx.beginPath(); // begin the drawing path
  ctx.lineWidth = line; // width of line
  ctx.lineCap = "round"; // rounded end cap
  ctx.strokeStyle = color; // hex color of line
  ctx.moveTo(pos.x, pos.y); // from position
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to position
  ctx.stroke(); // draw it!
}

canvas.addEventListener("mousedown", function(e) {
  isDrawing = true;
  setPosition(e);
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", function() {
  isDrawing = false;
});

canvas.addEventListener("mouseleave", function() {
  isDrawing = false;
});
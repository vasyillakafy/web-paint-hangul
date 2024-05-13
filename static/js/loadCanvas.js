var mousePressed = false;
var lastX, lastY;
var canvas;
var ctx;
var dashctx;
var selectedOption;
var color;
var line;

$(document).ready(function() {
  function updateSelectedOption() {
    selectedOption = $("input:radio[name=option]:checked").val();
    color = (selectedOption === 'brush') ? '#FFF' : '#000';
    line = (selectedOption === 'brush') ? 5 : 20; // Lebar garis 
  }
  updateSelectedOption();

  $('input[type=radio][name=option]').change(function() {
    updateSelectedOption();
  });
});

$(function () {
  InitThis();
})

function InitThis() {
    canvas = document.getElementById("myCanvas");
    canvas.style.cursor = "crosshair";
    ctx = canvas.getContext("2d"); // kuas
    dashctx = canvas.getContext("2d"); //garis kotak
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {
    if (isDown) {
      ctx.setLineDash([0, 0]); 
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = line;
      ctx.lineJoin = "round";
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();
    }
    lastX = x; lastY = y;
}

$(document).ready(function() {
  function dash(){
    dashctx.setLineDash([5, 5]);
    dashctx.lineWidth = 1;
    dashctx.strokeStyle = 'red';
    dashctx.strokeRect(200, 93, 230, 210); 
  }
  dash();

  $('#deleteButton').on('click', function () {
    clearArea();
    dash();
  });
});

function clearArea() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Fungsi untuk hide box resized image
var resizedImage = document.getElementById('resizedbox');
var predictedClass = document.getElementById('predictedClass');

function toggleImageVisibility() {
  if (predictedClass.textContent.trim() === "") {
    resizedImage.style.display = 'none';
  } else {
    resizedImage.style.display = 'block';
  }
}
predictedClass.addEventListener('DOMSubtreeModified', toggleImageVisibility);
toggleImageVisibility();

// -----------------------------------------------------------------------------------------------
// ----------------------------------------PROCESSING---------------------------------------------

var processAndSaveButton = document.getElementById("processAndSaveButton");
processAndSaveButton.addEventListener("click", function() {
  var imageDataURL = canvas.toDataURL();
  fetch('/process_image', {
    method: 'POST',
    body: JSON.stringify({ image_data: imageDataURL }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {

    var resizedImage = document.getElementById('resizedImage');
    var predictedClassElement = document.getElementById('predictedClass');

    // Ambil data URI gambar dari respons JSON
    var resizedDataURI = data.resized_data_uri;
    var predictedClass = data.predicted_class;
    var text = data.res;

    // Setel atribut src dari elemen gambar
    resizedImage.src = resizedDataURI;

    if(text){
      predictedClassElement.textContent = text;
    }else{
      predictedClassElement.textContent = predictedClass;
    }
  });
});

// ----------------------------------------PROCESSING---------------------------------------------
// -----------------------------------------------------------------------------------------------

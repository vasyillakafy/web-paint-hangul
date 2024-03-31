      // Fungsi untuk membuka modal dengan gambar cara penulisan huruf yang sesuai
      function openModal(letter, folder) {
        var modal = document.getElementById("myModal");
        var modalImage = document.getElementById("modalImage");
        var modalHeader = document.getElementById("modalHeader");
        modalHeader.src = "static/assets/" + folder + "/" + letter + "_header.png";
        modalImage.src = "static/assets/" + folder + "/" + letter + "_writing.png"
        modal.style.display = "block";
    }

    // Fungsi untuk menutup modal
    function closeModal() {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    }
    
    function scrollToTop() {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  }

  function scrollToElement(elementId) {
    var element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

// ---------------------------------------------------------------------------------------------------
// ----------------------------------------- C A N V A S ---------------------------------------------

var selectedOption;
var color;
var line;

$(document).ready(function() {
  function updateSelectedOption() {
    selectedOption = $("input:radio[name=option]:checked").val();
    color = (selectedOption === 'brush') ? '#FFF' : '#000';
    line = (selectedOption === 'brush') ? 7 : 20; // Lebar garis 
  }
  updateSelectedOption();

  // Update selectedOption, color, and line when the radio button changes
  $('input[type=radio][name=option]').change(function() {
    updateSelectedOption();
  });
});

var canvas = document.getElementById("draw");
var mousePressed = false;
var lastX, lastY;
var ctx = canvas.getContext("2d"); //kuas
var dashctx = canvas.getContext("2d"); //garis kotak

canvas.style.cursor = "crosshair";

$(document).ready(function() {
  function dash(){
    dashctx.setLineDash([5, 5]);
    dashctx.lineWidth = 1;
    dashctx.strokeStyle = 'red';
    dashctx.strokeRect(205, 160, 250, 240); 
  }
  dash();
  
  $('#refreshButton').click(function() {
    refresh();
    dash();
  });
});

var canvasRect = canvas.getBoundingClientRect();
canvas.width = canvasRect.width;

ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

function InitThis() {
    $('#draw').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, 
              e.pageY - $(this).offset().top, 
              false
        );
    });

    $('#draw').mousemove(function (e) {
      if (mousePressed) {
        Draw(e.pageX - $(this).offset().left, 
              e.pageY - $(this).offset().top, 
              true
        );
      }
    });

    $('#draw').mouseup(function (e) {
        mousePressed = false;
    });
    $('#draw').mouseleave(function (e) {
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
    lastX = x; 
    lastY = y;
}

$(function () {
  InitThis();
})

function refresh(){
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// ----------------------------------------- C A N V A S ---------------------------------------------
// ---------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------
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
    // var resizedContainer = document.getElementById("resizedContainer");
    // var dilatedContainer = document.getElementById("dilatedContainer");
    // var predictionContainer = document.getElementById("predictionContainer");

    // // Menampilkan gambar hasil resize
    // var resizedImage = document.createElement('img');
    // resizedImage.src = data.resized_data_uri;
    // resizedContainer.appendChild(resizedImage);

    // // Menampilkan gambar hasil dilatasi
    // var dilatedImage = document.createElement('img');
    // dilatedImage.src = data.dilated_data_uri;
    // dilatedContainer.appendChild(dilatedImage);

    // // Menampilkan hasil prediksi kelas
    // var predictedClassElement = document.createElement('p');
    // predictedClassElement.textContent = 'Predicted Class: ' + data.predicted_class;
    // predictionContainer.appendChild(predictedClassElement);

    var resizedImage = document.getElementById('resizedImage');
    // var dilatedImage = document.getElementById('dilatedImage');
    var predictedClassElement = document.getElementById('predictedClass');

    // Ambil data URI gambar dari respons JSON
    var resizedDataURI = data.resized_data_uri;
    // var dilatedDataURI = data.dilated_data_uri;
    var predictedClass = data.predicted_class;

    // Setel atribut src dari elemen gambar
    resizedImage.src = resizedDataURI;
    // dilatedImage.src = dilatedDataURI;

    // Tampilkan kelas prediksi
    predictedClassElement.textContent = predictedClass;
  });
});

// ----------------------------------------PROCESSING---------------------------------------------
// ---------------------------------------------------------------------------------------------------

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
// ---------------------------------------------------------------------------------------------------
// ----------------------------------------- C A N V A S ---------------------------------------------
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var toolSelect = document.getElementById("tool");
var w=$(window).width();
var h=$(window).height();

var canvasRect = canvas.getBoundingClientRect(); // Mendapatkan posisi dan ukuran aktual canvas di layar
canvas.width = canvasRect.width; 

document.getElementById("draw").style.cursor = "crosshair";
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, w, h);

// initialize position as 0,0
var pos = { x: 0, y: 0 };
var isDrawing = false;

// new position from mouse events
function setPosition(e) {
  pos.x = e.clientX - canvasRect.left;
  pos.y = e.clientY - canvasRect.top;
}

function draw(e) {
  if (!isDrawing) return;

  var color = (toolSelect.value === 'brush') ? '#FFF' : '#000';
  var line = (toolSelect.value === 'brush') ? 10 : 30; // Lebar garis 

  if (e.buttons !== 1) return; // if mouse is not clicked, do not go further
  ctx.beginPath(); // begin the drawing path
  ctx.lineWidth = line;
  ctx.lineCap = "round"; // rounded end cap
  ctx.strokeStyle = color;
  ctx.moveTo(pos.x, pos.y); // from position
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to position
  ctx.stroke(); // draw it!
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mousedown", function(e) {
  isDrawing = true;
  setPosition(e);
});
canvas.addEventListener("mouseup", function() {
  isDrawing = false;
});
canvas.addEventListener("mouseleave", function() {
  isDrawing = false;
});
// ----------------------------------------- C A N V A S ---------------------------------------------
// ---------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------
// ----------------------------------------PRE PROCESSING---------------------------------------------
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

// ----------------------------------------PRE PROCESSING---------------------------------------------
// ---------------------------------------------------------------------------------------------------

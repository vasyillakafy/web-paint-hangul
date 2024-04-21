      // Fungsi untuk membuka modal dengan gambar cara penulisan huruf yang sesuai
      function openModal(letter, folder) {
        var modal = document.getElementById("myModal");
        var modalImage = document.getElementById("modalImage");
        var modalHeader = document.getElementById("modalHeader");
        modalHeader.src = "static/assets/" + folder + "/" + letter + "_header.svg";
        modalImage.src = "static/assets/" + folder + "/" + letter + "_writing.svg"
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

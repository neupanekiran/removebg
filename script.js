const dropArea = document.querySelector(".drag-area");
const dragFile = dropArea.querySelector(".drag-file");
const button = dropArea.querySelector(".file-input-button");
const input = dropArea.querySelector(".file-input");
const progressBar = document.getElementById("progress");
const processProgressBar = progressBar.cloneNode(true);
let imageURL;
processProgressBar.classList.remove("hidden");

button.onclick = () => {
  input.click();
};

input.addEventListener("change", function (e) {
  const target = e.target;
  setttingFileValue(target);
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("bg-white", "border-4");
  dragFile.textContent = "Release to upload file";
  document.querySelectorAll(".upload-supplement").forEach(el => el.classList.add("hidden"));
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("bg-white", "border-4");
  dragFile.textContent = "Drag and drop image here";
  document.querySelectorAll(".upload-supplement").forEach(el => el.classList.remove("hidden"));
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  const target = e.dataTransfer;
  dropArea.classList.remove("bg-white", "border-4");
  dragFile.textContent = "Drag and drop image here";
  document.querySelectorAll(".upload-supplement").forEach(el => el.classList.remove("hidden"));
  setttingFileValue(target);
});

const setttingFileValue = async (target) => {
  const fileSize = target.files[0].size;
  let filesizeErrorMessage = document.getElementById("filesize-error");
  let filetypeErrorMessage = document.getElementById("filetype-error");
  let sizeInMB = Number.parseFloat(fileSize / (1024 * 1024)).toFixed(2);

  const fileTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (!fileTypes.includes(target.files[0].type)) {
    filesizeErrorMessage.classList.add("hidden");
    filetypeErrorMessage.classList.remove("hidden");
  } else if (sizeInMB > 50) {
    filetypeErrorMessage.classList.add("hidden");
    filesizeErrorMessage.classList.remove("hidden");
  } else {
    filetypeErrorMessage.classList.add("hidden");
    filesizeErrorMessage.classList.add("hidden");

    var reader = new FileReader();
    const previmage = document.getElementById('preview-image');
    reader.onload = function (e) {
      previmage.src = e.target.result;
    }
    reader.readAsDataURL(target.files[0]);
    setTimeout(() => previmage.classList.remove("hidden"), 500);

    const formData = new FormData();
    formData.append("image_file", target.files[0]);
    formData.append("size", "auto");

    dragFile.textContent = "Uploading...";
    progressBar.classList.remove("hidden");
    document.querySelectorAll(".upload-supplement").forEach(el => el.classList.add("hidden"));

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: "POST",
        headers: {
          'X-Api-Key': 'qQhG7fptH4NJq6hXXuV1Psen'
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const processedImage = document.createElement('img');
      processedImage.src = url;
      processedImage.id = "processed-image";
      processedImage.classList.add("processed-image-class");
      dropArea.innerHTML = ''; // Clear the drop area
      dropArea.appendChild(processedImage);

      // Add click event listener to the processed image to download it
      processedImage.addEventListener('click', () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = "edited_img.png";
        downloadLink.click();
      });

      // Update the button for downloading the processed image
      button.textContent = "Download";
      button.onclick = () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = "edited_img.png";
        downloadLink.click();
      };

      // Add event listener to the edit button to create the canvas
      const editButton = document.getElementById('edit');
      editButton.addEventListener("click", toggleEditSave);

      progressBar.classList.add("hidden");
      dragFile.textContent = "Processing...";

      dragFile.textContent = "Processing complete!";
    } catch (error) {
      console.error('Error during upload:', error);
      dragFile.textContent = "Error during upload.";
      progressBar.classList.add("hidden");
    }
  }
};

// Canvas Magic brush 

document.addEventListener("DOMContentLoaded", function() {
  const editButton = document.getElementById('edit');

  editButton.addEventListener('click', function() {
    // Ensure the createCanvas function is called with the correct image URL
    const processedImage = document.getElementById('processed-image');
    if (processedImage) {
      createCanvas(processedImage.src);
    }
  });
});

const createCanvas = (imageUrl) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    dropArea.innerHTML = ''; // Clear the drop area
    dropArea.appendChild(canvas);

    enableMagicBrush(canvas, ctx);
  };
  img.src = imageUrl;
};

const enableMagicBrush = (canvas, ctx) => {
  let isErasing = false;
  let brushSize = 20;

  // Change cursor to indicate brush
  canvas.style.cursor = "crosshair";

  canvas.addEventListener('mousedown', () => {
    isErasing = true;
  });

  canvas.addEventListener('mouseup', () => {
    isErasing = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isErasing) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
};

// Toggle edit/save functionality
const toggleEditSave = () => {
  const editButton = document.getElementById('edit');
  const canvas = dropArea.querySelector('canvas');

  if (editButton.textContent === "Edit") {
    const processedImage = document.getElementById('processed-image');
    if (processedImage) {
      createCanvas(processedImage.src);
    }
    editButton.textContent = "Save";
  } else {
    editButton.textContent = "Edit";
    if (canvas) {
      const editedImageUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = editedImageUrl;
      downloadLink.download = 'edited_img.png';
      downloadLink.click();
      dropArea.innerHTML = ''; // Clear the drop area
      const img = document.createElement('img');
      img.src = editedImageUrl;
      img.id = 'processed-image';
      img.classList.add('processed-image-class');
      dropArea.appendChild(img);
    }
  }
};

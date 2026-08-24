// Character counter
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

description.addEventListener("input", function () {
  charCount.textContent = this.value.length;
});

// Show selected files
const photosInput = document.getElementById("photos");
const fileList = document.getElementById("fileList");

photosInput.addEventListener("change", function () {
  fileList.innerHTML = "";
  const files = Array.from(this.files).slice(0, 3);
  files.forEach(function (file) {
    const p = document.createElement("p");
    p.textContent = "📷 " + file.name;
    fileList.appendChild(p);
  });
});

// Use current location
document
  .getElementById("useLocationBtn")
  .addEventListener("click", function () {
    document.getElementById("location").value = "Current Location";
    alert("Location detected!");
  });

// ========== MAIN SUBMIT FUNCTION ==========
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const urgency = document.getElementById("urgency").value;
  const location = document.getElementById("location").value;
  const descriptionValue = document.getElementById("description").value;
  const photoInput = document.getElementById("photos");

  // Validation
  if (!category || !location || !descriptionValue) {
    alert("Please fill in all required fields!");
    return;
  }

  // Function that actually saves the report
  function saveReport(imageData) {
    let reports = JSON.parse(localStorage.getItem("civicReports")) || [];

    const report = {
      referenceId: "CR-" + Date.now().toString().slice(-6),
      category: category,
      urgency: urgency,
      location: location,
      description: descriptionValue,
      status: "Reported",
      date: new Date().toLocaleDateString(),
      image: imageData || null, // ← this is the important part
    };

    reports.push(report);
    localStorage.setItem("civicReports", JSON.stringify(reports));

    alert(
      "Report submitted successfully!\n\nReference ID: " + report.referenceId,
    );

    // Clear form
    document.getElementById("reportForm").reset();
    charCount.textContent = "0";
    fileList.innerHTML = "";
  }

  // Check if user uploaded an image
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();

    reader.onload = function (event) {
      // event.target.result contains the base64 image
      saveReport(event.target.result);
    };

    reader.readAsDataURL(photoInput.files[0]);
  } else {
    // No image uploaded
    saveReport(null);
  }
});

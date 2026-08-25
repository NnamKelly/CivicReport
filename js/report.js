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

// Use Current Location
document
  .getElementById("useLocationBtn")
  .addEventListener("click", function () {
    document.getElementById("location").value = "Current Location";
    alert("Location detected!");
  });

// ========== FORM SUBMIT ==========
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values
  const reporterName = document.getElementById("reporterName").value.trim();
  const reporterPhone = document.getElementById("reporterPhone").value.trim();
  const category = document.getElementById("category").value;
  const urgency = document.getElementById("urgency").value;
  const location = document.getElementById("location").value.trim();
  const descriptionValue = document.getElementById("description").value.trim();
  const photoInput = document.getElementById("photos");

  // Validation
  if (
    !reporterName ||
    !reporterPhone ||
    !category ||
    !location ||
    !descriptionValue
  ) {
    alert(
      "Please fill in all required fields (Name, Phone, Category, Location and Description)!",
    );
    return;
  }

  // Simple phone validation
  if (reporterPhone.length < 10) {
    alert("Please enter a valid telephone number!");
    return;
  }

  // Function to save the report
  function saveReport(imageData) {
    const refId = "CR-" + Date.now().toString().slice(-6);

    const report = {
      referenceId: refId,
      reporterName: reporterName, // ← saved for admin
      reporterPhone: reporterPhone, // ← saved for admin
      category: category,
      urgency: urgency,
      location: location,
      description: descriptionValue,
      status: "Reported",
      date: new Date().toLocaleString(),
      image: imageData || null,
    };

    // Get existing reports
    let reports = JSON.parse(localStorage.getItem("civicReports")) || [];

    // Add new report
    reports.push(report);

    // Save to localStorage
    localStorage.setItem("civicReports", JSON.stringify(reports));

    alert("Report submitted successfully!\n\nYour Reference ID: " + refId);

    // Clear form
    document.getElementById("reportForm").reset();
    charCount.textContent = "0";
    fileList.innerHTML = "";
  }

  // Handle image upload
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      saveReport(event.target.result); // save with image
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    saveReport(null); // save without image
  }
});

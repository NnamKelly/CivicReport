// counter
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

description.addEventListener("input", function () {
  charCount.textContent = this.value.length;
});

//selected files
const photosInput = document.getElementById("photos");
const fileList = document.getElementById("fileList");

photosInput.addEventListener("change", function () {
  fileList.innerHTML = "";
  const files = Array.from(this.files).slice(0, 3); // max 3 files

  files.forEach(function (file) {
    const p = document.createElement("p");
    p.textContent = "📷 " + file.name;
    fileList.appendChild(p);
  });
});

// Current Location
document
  .getElementById("useLocationBtn")
  .addEventListener("click", function () {
    document.getElementById("location").value = "Current Location ";
    alert("Location detected!");
  });

// Form Submit
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // get values
  const category = document.getElementById("category").value;
  const urgency = document.getElementById("urgency").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  // validation
  if (!category || !location || !description) {
    alert("Please fill in all required fields!");
    return;
  }

  // reference ID
  const refId = "CR-" + Date.now().toString().slice(-8);

  // report object
  const report = {
    referenceId: refId,
    category: category,
    urgency: urgency,
    location: location,
    description: description,
    date: new Date().toLocaleString(),
  };

  // Get existing reports from localStorage
  let reports = JSON.parse(localStorage.getItem("civicReports")) || [];

  // new report
  reports.push(report);

  // Save  to localStorage
  localStorage.setItem("civicReports", JSON.stringify(reports));

  // Success message
  alert("Report submitted successfully!\n\nYour Reference ID: " + refId);

  // Clear the form
  document.getElementById("reportForm").reset();
  charCount.textContent = "0";
  fileList.innerHTML = "";
});

// nub of char
const description = document.getElementById("description");
const charCount = document.getElementById("charCount");

description.addEventListener("input", function () {
  charCount.textContent = this.value.length;
});

// select
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

// current location
document
  .getElementById("useLocationBtn")
  .addEventListener("click", function () {
    document.getElementById("location").value = "Current Location";
    alert("Location detected!");
  });

//edit
const editReferenceId = new URLSearchParams(window.location.search).get("edit");
let editingReport = null;

if (editReferenceId) {
  const reports = JSON.parse(localStorage.getItem("civicReports") || "[]");
  editingReport = reports.find(
    (report) => report.referenceId === editReferenceId,
  );

  if (editingReport) {
    document.getElementById("category").value = editingReport.category || "";
    document.getElementById("urgency").value = editingReport.urgency || "";
    document.getElementById("location").value = editingReport.location || "";
    document.getElementById("description").value =
      editingReport.description || "";
    charCount.textContent = document.getElementById("description").value.length;
    document.querySelector("#reportForm button[type='submit']").textContent =
      "Save Changes";
  }
}

// submit form
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault(); // stop page refresh

  // Get form values
  const category = document.getElementById("category").value;
  const urgency = document.getElementById("urgency").value;
  const location = document.getElementById("location").value;
  const descriptionValue = document.getElementById("description").value;

  // Validation
  if (!category || !location || !descriptionValue) {
    alert("Please fill in all required fields!");
    return;
  }

  // Get existing reports from localStorage
  let reports = JSON.parse(localStorage.getItem("civicReports")) || [];

  if (editingReport) {
    const reportIndex = reports.findIndex(
      (report) => report.referenceId === editingReport.referenceId,
    );
    reports[reportIndex] = {
      ...reports[reportIndex],
      category,
      urgency,
      location,
      description: descriptionValue,
    };
  } else {
    const refId = "CR-" + Date.now().toString().slice(-6);
    reports.push({
      referenceId: refId,
      category,
      urgency,
      location,
      description: descriptionValue,
      status: "Reported",
      date: new Date().toLocaleDateString(),
    });
  }

  // Save back to localStorage
  localStorage.setItem("civicReports", JSON.stringify(reports));

  // Success message
  alert(
    editingReport
      ? "Report updated successfully!"
      : "Report submitted successfully!\n\nYour Reference ID: " +
          reports[reports.length - 1].referenceId,
  );

  // Clear the form
  document.getElementById("reportForm").reset();
  charCount.textContent = "0";
  fileList.innerHTML = "";
});

let allReports = [];
let currentFilter = "all";

// Load reports from localStorage
function loadReports() {
  allReports = JSON.parse(localStorage.getItem("civicReports")) || [];
  updateStats();
  showReports();
}

function updateStats() {
  let resolved = 0;
  allReports.forEach(function (r) {
    if (r.status === "Resolved") resolved++;
  });
  document.getElementById("resolvedCount").textContent = resolved;
}

function showReports() {
  const list = document.getElementById("reportList");
  list.innerHTML = "";

  let filtered = allReports;

  // Filter
  if (currentFilter !== "all") {
    filtered = filtered.filter((r) => r.status === currentFilter);
  }

  // Search
  const search = document.getElementById("searchInput").value.toLowerCase();
  if (search) {
    filtered = filtered.filter(
      (r) =>
        (r.category && r.category.toLowerCase().includes(search)) ||
        (r.location && r.location.toLowerCase().includes(search)) ||
        (r.referenceId && r.referenceId.toLowerCase().includes(search)),
    );
  }

  // Newest first
  filtered = filtered.slice().reverse();

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty">No reports found</div>`;
    return;
  }

  // ========== SHOW ONLY 3 REPORTS AT A TIME ==========
  // The container will be scrollable so user can see the rest
  filtered.forEach(function (report) {
    let priorityClass = "medium";
    let priorityText = "MEDIUM PRIORITY";

    if (
      report.urgency &&
      (report.urgency.includes("High") || report.urgency.includes("Critical"))
    ) {
      priorityClass = "high";
      priorityText = "HIGH PRIORITY";
    }

    const card = document.createElement("div");
    card.className = "report-card";

    card.innerHTML = `
      <div class="report-top">
        <span class="priority ${priorityClass}">${priorityText}</span>
        <span class="report-id">${report.referenceId} • ${report.date}</span>
      </div>
      <div class="report-title">${report.category}</div>
      <div class="report-desc">${report.description || "No description"}</div>
      <div class="report-bottom">
        <span class="location">📍 ${report.location || "Unknown"}</span>
        <div class="btns">
          <button class="view-link" onclick="viewReport('${report.referenceId}')">View Details</button>
          ${
            report.status !== "In Progress" && report.status !== "Resolved"
              ? `<button onclick="changeStatus('${report.referenceId}', 'In Progress')">Mark In Progress</button>`
              : ""
          }
          ${
            report.status !== "Resolved"
              ? `<button class="primary" onclick="changeStatus('${report.referenceId}', 'Resolved')">Resolve</button>`
              : `<button disabled>Resolved</button>`
          }
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function changeStatus(id, newStatus) {
  let reports = JSON.parse(localStorage.getItem("civicReports")) || [];

  reports = reports.map(function (r) {
    if (r.referenceId === id) {
      r.status = newStatus;
    }
    return r;
  });

  localStorage.setItem("civicReports", JSON.stringify(reports));
  allReports = reports;

  updateStats();
  showReports();
  alert("Status changed to: " + newStatus);
}

function viewReport(id) {
  const report = allReports.find((r) => r.referenceId === id);
  if (report) {
    alert(
      "ID: " +
        report.referenceId +
        "\n" +
        "Category: " +
        report.category +
        "\n" +
        "Location: " +
        report.location +
        "\n" +
        "Status: " +
        report.status +
        "\n" +
        "Date: " +
        report.date,
    );
  }
}

function filterStatus(status) {
  currentFilter = status;

  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.classList.remove("active");
  });
  event.target.classList.add("active");

  showReports();
}

// Live search
document.getElementById("searchInput").addEventListener("input", showReports);

// Start
loadReports();

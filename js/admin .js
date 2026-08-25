let allIncidents = [];
let filteredIncidents = [];
let currentPage = 1;
const perPage = 5;
let editingId = null;

function loadData() {
  const saved = JSON.parse(localStorage.getItem("civicReports")) || [];

  if (saved.length > 0) {
    allIncidents = saved.map((r) => ({
      referenceId:
        r.referenceId || "#INC-" + Math.floor(Math.random() * 9000 + 1000),
      date: r.date || "Unknown",
      category: r.category || "Unknown",
      location: r.location || "Not specified",
      status: r.status || "Reported",
      description: r.description || "No description",
      urgency: r.urgency || "Not set",
      reporterName: r.reporterName || "Not provided", // ← added
      reporterPhone: r.reporterPhone || "Not provided", // ← added
    }));
  } else {
    allIncidents = [];
  }

  filteredIncidents = [...allIncidents];
  updateStats();
  renderTable();
}

function updateStats() {
  const total = allIncidents.length || 1;

  document.getElementById("totalReports").textContent =
    allIncidents.length.toLocaleString();

  let open = 0;
  let review = 0;
  let resolved = 0;

  allIncidents.forEach(function (item) {
    if (item.status === "Resolved") {
      resolved++;
    } else if (item.status === "Under Review") {
      review++;
    } else {
      open++;
    }
  });

  document.getElementById("openCount").textContent = open;
  document.getElementById("reviewCount").textContent = review;
  document.getElementById("resolvedCount").textContent = resolved;
  document.getElementById("todayCount").textContent = Math.min(
    5,
    allIncidents.length,
  );

  // Update bars
  const openPercent = Math.round((open / total) * 100);
  const reviewPercent = Math.round((review / total) * 100);
  const resolvedPercent = Math.round((resolved / total) * 100);

  if (document.getElementById("openBar")) {
    document.getElementById("openBar").style.width = openPercent + "%";
  }
  if (document.getElementById("reviewBar")) {
    document.getElementById("reviewBar").style.width = reviewPercent + "%";
  }
  if (document.getElementById("resolvedBar")) {
    document.getElementById("resolvedBar").style.width = resolvedPercent + "%";
  }
}

function getBadge(status) {
  if (status === "Pending") return '<span class="badge pending">Pending</span>';
  if (status === "Under Review")
    return '<span class="badge under-review">Under Review</span>';
  if (status === "Resolved")
    return '<span class="badge resolved">Resolved</span>';
  if (status === "In Progress")
    return '<span class="badge" style="background:#f3e8ff;color:#7e22ce;">In Progress</span>';
  return '<span class="badge reported">Reported</span>';
}

function renderTable() {
  const tbody = document.getElementById("incidentsTable");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * perPage;
  const pageData = filteredIncidents.slice(start, start + perPage);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#94a3b8;">No incidents found</td></tr>`;
  } else {
    pageData.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${item.referenceId}</strong></td>
        <td>${item.date}</td>
        <td>${item.category}</td>
        <td>${item.location}</td>
        <td>${getBadge(item.status)}</td>
        <td>
          <button class="action-btn" onclick="viewItem('${item.referenceId}')">👁️</button>
          <button class="action-btn" onclick="openEdit('${item.referenceId}')">✏️</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  document.getElementById("showingText").textContent =
    `Showing ${pageData.length} of ${filteredIncidents.length} entries`;
}

function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("statusFilter").value;

  filteredIncidents = allIncidents.filter((item) => {
    const matchSearch =
      item.referenceId.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      (item.reporterName && item.reporterName.toLowerCase().includes(search));

    const matchCategory = category === "All" || item.category === category;
    const matchStatus = status === "All" || item.status === status;

    return matchSearch && matchCategory && matchStatus;
  });

  currentPage = 1;
  renderTable();
}

// view report
function viewItem(id) {
  const item = allIncidents.find((i) => i.referenceId === id);
  if (!item) {
    alert("Report not found!");
    return;
  }

  // modal data
  document.getElementById("modalId").textContent = item.referenceId;
  document.getElementById("modalCategory").textContent = item.category;
  document.getElementById("modalLocation").textContent = item.location;
  document.getElementById("modalUrgency").textContent =
    item.urgency || "Not set";
  document.getElementById("modalStatus").textContent = item.status;
  document.getElementById("modalDate").textContent = item.date;
  document.getElementById("modalName").textContent =
    item.reporterName || "Not provided";
  document.getElementById("modalPhone").textContent =
    item.reporterPhone || "Not provided";
  document.getElementById("modalDescription").textContent =
    item.description || "No description";

  // Show the modal
  document.getElementById("viewModal").style.display = "flex";
}

// Close the modal
function closeModal() {
  document.getElementById("viewModal").style.display = "none";
}

// Close modal when clicking outside of it
window.addEventListener("click", function (e) {
  const modal = document.getElementById("viewModal");
  if (e.target === modal) {
    closeModal();
  }
});

// Open edit status
function openEdit(id) {
  const item = allIncidents.find((i) => i.referenceId === id);

  if (!item) {
    alert("Report not found!");
    return;
  }

  const newStatus = prompt(
    `Change status for ${id}\n\nCurrent status: ${item.status}\n\nType one of these:\n- Pending\n- Under Review\n- In Progress\n- Reported\n- Resolved`,
    item.status,
  );

  if (newStatus === null || newStatus.trim() === "") {
    return;
  }

  updateStatus(id, newStatus.trim());
}

// Update status
function updateStatus(id, newStatus) {
  allIncidents = allIncidents.map(function (item) {
    if (item.referenceId === id) {
      item.status = newStatus;
    }
    return item;
  });

  let savedReports = JSON.parse(localStorage.getItem("civicReports")) || [];

  savedReports = savedReports.map(function (report) {
    if (report.referenceId === id) {
      report.status = newStatus;
    }
    return report;
  });

  localStorage.setItem("civicReports", JSON.stringify(savedReports));

  filteredIncidents = [...allIncidents];
  updateStats();
  applyFilters();
  renderTable();

  alert("✅ Status successfully changed to: " + newStatus);
}

function downloadCSV() {
  let csv = "ID,Date,Category,Location,Status,Reporter Name,Reporter Phone\n";
  allIncidents.forEach((i) => {
    csv += `${i.referenceId},${i.date},${i.category},${i.location},${i.status},${i.reporterName},${i.reporterPhone}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "incidents.csv";
  a.click();
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(allIncidents, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "incidents.json";
  a.click();
}

function nextPage() {
  if (currentPage * perPage < filteredIncidents.length) {
    currentPage++;
    renderTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

// Event listeners
document.getElementById("searchInput").addEventListener("input", applyFilters);
document
  .getElementById("categoryFilter")
  .addEventListener("change", applyFilters);
document
  .getElementById("statusFilter")
  .addEventListener("change", applyFilters);

// Start
loadData();

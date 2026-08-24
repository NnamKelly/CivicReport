let allReports = [];
let filteredReports = [];
let currentFilter = "all";
let visibleCount = 6;

// Load reports from localStorage
function loadReports() {
  const saved = JSON.parse(localStorage.getItem("civicReports")) || [];

  if (saved.length > 0) {
    allReports = saved;
  } else {
  }

  filteredReports = [...allReports];
  renderFeed();
}

// Create status badge
function getStatusBadge(status) {
  if (status === "Resolved")
    return '<span class="status-badge status-resolved">Resolved</span>';
  if (status === "Pending" || status === "Under Review")
    return '<span class="status-badge status-pending">Pending</span>';
  if (status === "In Progress")
    return '<span class="status-badge status-progress">In Progress</span>';
  return '<span class="status-badge status-reported">Reported</span>';
}

// Render the cards
function renderFeed() {
  const grid = document.getElementById("feedGrid");
  grid.innerHTML = "";

  const toShow = filteredReports.slice(0, visibleCount);

  if (toShow.length === 0) {
    grid.innerHTML = `<div class="empty">No incidents found</div>`;
    return;
  }

  toShow.forEach(function (report) {
    const card = document.createElement("div");
    card.className = "card";

    // Simple placeholder image based on category
    let imageContent = "📷 No Image";
    if (
      report.category &&
      report.category.toLowerCase().includes("infrastructure")
    ) {
      imageContent = "🛣️ Infrastructure";
    } else if (
      report.category &&
      report.category.toLowerCase().includes("vandalism")
    ) {
      imageContent = "🖊 Vandalism";
    }

    card.innerHTML = `
          <div class="card-image">
            ${imageContent}
            ${getStatusBadge(report.status)}
          </div>
          <div class="card-body">
            <div class="card-meta">
              <span class="category-tag">${report.category || "General"}</span>
              <span class="time-ago">${report.date || "Recently"}</span>
            </div>
            <div class="card-title">${report.title || report.category}</div>
            <div class="card-desc">${report.description || "No description available."}</div>
            <div class="card-footer">
              <div class="tracking">👥 ${Math.floor(Math.random() * 40) + 5} tracking</div>
              <button class="view-btn" onclick="viewDetails('${report.referenceId}')">View Details</button>
            </div>
          </div>
        `;

    grid.appendChild(card);
  });
}

// Filter buttons
document
  .getElementById("filterButtons")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("filter-btn")) {
      // Remove active from all
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      currentFilter = e.target.getAttribute("data-filter");
      applyFilters();
    }
  });

// Apply search + filter
function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();

  filteredReports = allReports.filter(function (report) {
    // Search
    const matchSearch =
      !search ||
      (report.category && report.category.toLowerCase().includes(search)) ||
      (report.description &&
        report.description.toLowerCase().includes(search)) ||
      (report.location && report.location.toLowerCase().includes(search)) ||
      (report.referenceId && report.referenceId.toLowerCase().includes(search));

    // Category / Status filter
    let matchFilter = true;
    if (currentFilter === "all" || currentFilter === "all-categories") {
      matchFilter = true;
    } else if (
      currentFilter === "Pending" ||
      currentFilter === "Resolved" ||
      currentFilter === "In Progress"
    ) {
      matchFilter = report.status === currentFilter;
    } else {
      matchFilter =
        report.category &&
        report.category.toLowerCase().includes(currentFilter.toLowerCase());
    }

    return matchSearch && matchFilter;
  });

  visibleCount = 6;
  renderFeed();
}

// Live search
document.getElementById("searchInput").addEventListener("input", applyFilters);

// View details
function viewDetails(id) {
  const report = allReports.find((r) => r.referenceId === id);
  if (report) {
    alert(
      `Incident Details\n\n` +
        `ID: ${report.referenceId}\n` +
        `Category: ${report.category}\n` +
        `Status: ${report.status}\n` +
        `Location: ${report.location || "Not specified"}\n` +
        `Date: ${report.date}\n\n` +
        `Description:\n${report.description || "No description"}`,
    );
  }
}

// Load more
function loadMore() {
  visibleCount += 3;
  renderFeed();
}

// Start
loadReports();

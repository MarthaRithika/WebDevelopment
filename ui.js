
function showToast(msg, type = "info") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast " + type + " show";
  setTimeout(() => t.classList.remove("show"), 3000);
}


function navigateTo(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const el = document.getElementById("page-" + page);
  if (el) el.classList.add("active");
  const navEl = document.getElementById("nav-" + page);
  if (navEl) navEl.classList.add("active");
  window.scrollTo(0, 0);
  if (page === "home") renderHome();
  if (page === "jobs") renderJobsPage();
  if (page === "dashboard") renderDashboard();
  if (page === "admin") renderAdmin();
}


function renderHome() {
  renderCategories();
  renderFeaturedJobs();
}
function renderCategories() {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(c => `
    <div class="category-card" onclick="filterByCategory('${c.name}')">
      <div class="cat-icon">${c.icon}</div>
      <div class="cat-name">${c.name}</div>
      <div class="cat-count">${c.count} jobs</div>
    </div>`).join("");
}
function renderFeaturedJobs() {
  const grid = document.getElementById("featured-jobs-grid");
  if (!grid) return;
  const jobs = getJobs().filter(j => j.featured).slice(0, 6);
  grid.innerHTML = jobs.map(j => jobCardHTML(j)).join("");
}
function filterByCategory(cat) {
  navigateTo("jobs");
  setTimeout(() => {
    document.getElementById("filter-category").value = cat;
    applyFilters();
  }, 100);
}


function jobCardHTML(job) {
  const saved = getSaved().includes(job.id);
  const logo = job.company.charAt(0).toUpperCase();
  return `
    <div class="job-card" id="card-${job.id}">
      <div class="job-card-header">
        <div class="company-logo">${logo}</div>
        <button class="save-btn ${saved ? "saved" : ""}" onclick="toggleSave(event,'${job.id}')" title="Save job">
          ${saved ? "🔖" : "🔖"}
        </button>
      </div>
      <div class="job-title">${job.title}</div>
      <div class="job-company">${job.company} · ${job.location}</div>
      <div class="job-meta">
        <span class="tag type">${job.type}</span>
        <span class="tag">${job.experience}</span>
        <span class="tag">${job.category}</span>
      </div>
      <div class="job-salary">${job.salary}</div>
      <div class="job-card-footer">
        <span class="job-date">${timeAgo(job.posted)}</span>
        <button class="btn btn-primary btn-sm" onclick="viewJob('${job.id}')">View Details</button>
      </div>
    </div>`;
}


let currentFilters = { search: "", location: "", types: [], category: "", experience: "" };
function renderJobsPage() {
  const cats = document.getElementById("filter-category");
  if (cats && cats.options.length <= 1) {
    CATEGORIES.forEach(c => {
      const o = document.createElement("option");
      o.value = c.name; o.textContent = c.name;
      cats.appendChild(o);
    });
  }
  applyFilters();
}
function applyFilters() {
  const search = (document.getElementById("filter-search")?.value || "").toLowerCase();
  const location = (document.getElementById("filter-location")?.value || "").toLowerCase();
  const category = document.getElementById("filter-category")?.value || "";
  const experience = document.getElementById("filter-experience")?.value || "";
  const typeChecks = document.querySelectorAll("#type-filters input:checked");
  const types = Array.from(typeChecks).map(c => c.value);
  const sort = document.getElementById("sort-jobs")?.value || "newest";
  let jobs = getJobs().filter(j => {
    if (search && !j.title.toLowerCase().includes(search) && !j.company.toLowerCase().includes(search) && !j.description.toLowerCase().includes(search)) return false;
    if (location && !j.location.toLowerCase().includes(location)) return false;
    if (types.length && !types.includes(j.type)) return false;
    if (category && j.category !== category) return false;
    if (experience && j.experience !== experience) return false;
    return true;
  });
  if (sort === "newest") jobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  else if (sort === "oldest") jobs.sort((a, b) => new Date(a.posted) - new Date(b.posted));
  else if (sort === "salary-high") jobs.sort((a, b) => b.salaryNum - a.salaryNum);
  else if (sort === "salary-low") jobs.sort((a, b) => a.salaryNum - b.salaryNum);
  document.getElementById("jobs-count").textContent = `Showing ${jobs.length} job${jobs.length !== 1 ? "s" : ""}`;
  const list = document.getElementById("jobs-list");
  const noMsg = document.getElementById("no-jobs-msg");
  if (!jobs.length) { list.innerHTML = ""; noMsg.classList.remove("hidden"); return; }
  noMsg.classList.add("hidden");
  list.innerHTML = jobs.map(j => jobListCardHTML(j)).join("");
}
function jobListCardHTML(job) {
  const logo = job.company.charAt(0).toUpperCase();
  const saved = getSaved().includes(job.id);
  return `
    <div class="job-list-card">
      <div class="company-logo">${logo}</div>
      <div class="jlc-info">
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company} · ${job.location}</div>
        <div class="job-meta" style="margin-top:8px">
          <span class="tag type">${job.type}</span>
          <span class="tag">${job.experience}</span>
          <span class="tag">${job.category}</span>
        </div>
      </div>
      <div class="jlc-actions">
        <div class="job-salary">${job.salary}</div>
        <button class="btn btn-primary btn-sm" onclick="viewJob('${job.id}')">View</button>
        <button class="save-btn ${saved ? "saved" : ""}" onclick="toggleSave(event,'${job.id}')" title="Save">🔖</button>
      </div>
    </div>`;
}
function clearFilters() {
  document.getElementById("filter-search").value = "";
  document.getElementById("filter-location").value = "";
  document.getElementById("filter-category").value = "";
  document.getElementById("filter-experience").value = "";
  document.querySelectorAll("#type-filters input").forEach(c => c.checked = false);
  applyFilters();
}


function toggleSave(e, jobId) {
  e.stopPropagation();
  const user = getCurrentUser();
  if (!user) { openAuthModal("login"); showToast("Login to save jobs", "info"); return; }
  let saved = getSaved();
  const key = user.id + "_" + jobId;
  const idx = saved.indexOf(key);
  if (idx === -1) { saved.push(key); showToast("Job saved!", "success"); }
  else { saved.splice(idx, 1); showToast("Job removed from saved.", "info"); }
  saveSaved(saved);
}

function getSavedForUser() {
  const user = getCurrentUser();
  if (!user) return [];
  const all = getSaved();
  return all.filter(k => k.startsWith(user.id + "_")).map(k => k.split("_").slice(1).join("_"));
}


function viewJob(jobId) {
  const job = getJobs().find(j => j.id === jobId);
  if (!job) return;
  const apps = getApplications();
  const user = getCurrentUser();
  const alreadyApplied = user && apps.some(a => a.jobId === jobId && a.userId === user.id);
  const logo = job.company.charAt(0).toUpperCase();
  document.getElementById("job-detail-content").innerHTML = `
    <div class="back-btn" onclick="navigateTo('jobs')">← Back to Jobs</div>
    <div class="detail-hero">
      <div class="detail-header">
        <div class="detail-logo">${logo}</div>
        <div>
          <div class="detail-title">${job.title}</div>
          <div class="detail-company">${job.company}</div>
        </div>
      </div>
      <div class="detail-meta">
        <span class="tag type">${job.type}</span>
        <span class="tag">📍 ${job.location}</span>
        <span class="tag">${job.experience} Level</span>
        <span class="tag">🏷 ${job.category}</span>
        ${job.deadline ? `<span class="tag">⏰ Deadline: ${job.deadline}</span>` : ""}
      </div>
      <div class="detail-actions">
        ${alreadyApplied
          ? `<button class="btn btn-ghost" disabled>✅ Already Applied</button>`
          : `<button class="btn btn-primary btn-lg" onclick="openApplyModal('${job.id}')">Apply Now</button>`}
        <button class="btn btn-ghost" onclick="toggleSaveDetail('${job.id}')">🔖 Save Job</button>
      </div>
    </div>
    <div class="detail-body">
      <div>
        <div class="detail-section">
          <h3>Job Description</h3>
          <p>${job.description}</p>
        </div>
        <div class="detail-section">
          <h3>Requirements</h3>
          <ul>${(job.requirements || []).map(r => `<li>${r}</li>`).join("")}</ul>
        </div>
        <div class="detail-section">
          <h3>Skills Required</h3>
          <div class="skills-tags">${(job.skills || []).map(s => `<span class="tag">${s}</span>`).join("")}</div>
        </div>
      </div>
      <div>
        <div class="sidebar-card">
          <h4>Job Overview</h4>
          <div class="sidebar-info-row"><span class="sir-label">Salary</span><span class="sir-value">${job.salary}</span></div>
          <div class="sidebar-info-row"><span class="sir-label">Job Type</span><span class="sir-value">${job.type}</span></div>
          <div class="sidebar-info-row"><span class="sir-label">Location</span><span class="sir-value">${job.location}</span></div>
          <div class="sidebar-info-row"><span class="sir-label">Experience</span><span class="sir-value">${job.experience}</span></div>
          <div class="sidebar-info-row"><span class="sir-label">Category</span><span class="sir-value">${job.category}</span></div>
          <div class="sidebar-info-row"><span class="sir-label">Posted</span><span class="sir-value">${timeAgo(job.posted)}</span></div>
        </div>
      </div>
    </div>`;
  navigateTo("job-detail");
}
function toggleSaveDetail(jobId) {
  const user = getCurrentUser();
  if (!user) { openAuthModal("login"); return; }
  let saved = getSaved();
  const key = user.id + "_" + jobId;
  if (!saved.includes(key)) { saved.push(key); showToast("Job saved!", "success"); }
  else { saved = saved.filter(k => k !== key); showToast("Removed from saved.", "info"); }
  saveSaved(saved);
}


let applyJobId = null;
function openApplyModal(jobId) {
  const user = getCurrentUser();
  if (!user) { openAuthModal("login"); showToast("Please login to apply.", "info"); return; }
  applyJobId = jobId;
  const job = getJobs().find(j => j.id === jobId);
  document.getElementById("apply-job-title-label").textContent = job ? job.title + " at " + job.company : "";
  document.getElementById("apply-name").value = user.name || "";
  document.getElementById("apply-email").value = user.email || "";
  document.getElementById("apply-phone").value = user.phone || "";
  document.getElementById("apply-modal").classList.add("open");
}
function handleApply(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user || !applyJobId) return;
  const apps = getApplications();
  if (apps.some(a => a.jobId === applyJobId && a.userId === user.id)) {
    showToast("Already applied!", "error"); return;
  }
  const application = {
    id: "app" + Date.now(),
    jobId: applyJobId,
    userId: user.id,
    name: document.getElementById("apply-name").value,
    email: document.getElementById("apply-email").value,
    phone: document.getElementById("apply-phone").value,
    cover: document.getElementById("apply-cover").value,
    resume: document.getElementById("apply-resume").value,
    status: "Pending",
    appliedOn: new Date().toISOString().split("T")[0],
  };
  apps.push(application);
  saveApplications(apps);
  document.getElementById("apply-modal").classList.remove("open");
  document.getElementById("apply-form").reset();
  showToast("Application submitted successfully! 🎉", "success");
  viewJob(applyJobId);
}

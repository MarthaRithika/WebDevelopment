
function renderDashboard() {
  const user = getCurrentUser();
  if (!user) { navigateTo("home"); openAuthModal("login"); return; }
  document.getElementById("dashboard-greeting").textContent = "Welcome back, " + user.name + "!";
  

  if (user.role === "recruiter") {
    const savedKeys = getSaved().filter(k => k.startsWith(user.id + "_"));
    document.getElementById("dashboard-stats").innerHTML = `
      <div class="stat-card"><div class="stat-icon">🏢</div><div class="stat-value">Recruiter</div><div class="stat-label">Account Type</div></div>
      <div class="stat-card"><div class="stat-icon">🔖</div><div class="stat-value">${savedKeys.length}</div><div class="stat-label">Saved Jobs</div></div>`;
    document.getElementById("tab-content-applications").innerHTML = `<div class="recruiter-panel">
      <div class="recruiter-icon">🏢</div>
      <h3>You're a Recruiter!</h3>
      <p>Post and manage job listings via the Admin Panel. Contact an administrator to get admin access.</p>
      <button class="btn btn-primary" onclick="navigateTo('home')">Browse Home</button>
    </div>`;
    renderSavedJobsList(savedKeys);
    renderProfileForm(user);
    return;
  }
  const apps = getApplications().filter(a => a.userId === user.id);
  const savedKeys = getSaved().filter(k => k.startsWith(user.id + "_"));
  document.getElementById("dashboard-stats").innerHTML = `
    <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-value">${apps.length}</div><div class="stat-label">Applications</div></div>
    <div class="stat-card"><div class="stat-icon">🔖</div><div class="stat-value">${savedKeys.length}</div><div class="stat-label">Saved Jobs</div></div>
    <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-value">${apps.filter(a=>a.status==="Accepted").length}</div><div class="stat-label">Accepted</div></div>
    <div class="stat-card"><div class="stat-icon">⏳</div><div class="stat-value">${apps.filter(a=>a.status==="Pending").length}</div><div class="stat-label">Pending</div></div>`;
  renderApplicationsList(apps);
  renderSavedJobsList(savedKeys);
  renderProfileForm(user);
}
function renderApplicationsList(apps) {
  const list = document.getElementById("applications-list");
  const noMsg = document.getElementById("no-apps-msg");
  if (!apps.length) { list.innerHTML = ""; noMsg.classList.remove("hidden"); return; }
  noMsg.classList.add("hidden");
  const jobs = getJobs();
  list.innerHTML = apps.map(a => {
    const job = jobs.find(j => j.id === a.jobId);
    return `<div class="app-card">
      <div class="app-info">
        <div class="job-title">${job ? job.title : "Job Deleted"}</div>
        <div class="job-company">${job ? job.company : ""} · Applied on ${a.appliedOn}</div>
      </div>
      <span class="app-status status-${a.status.toLowerCase()}">${a.status}</span>
    </div>`;
  }).join("");
}
function renderSavedJobsList(savedKeys) {
  const grid = document.getElementById("saved-jobs-list");
  const noMsg = document.getElementById("no-saved-msg");
  const jobs = getJobs();
  const savedJobs = savedKeys.map(k => {
    const jobId = k.split("_").slice(1).join("_");
    return jobs.find(j => j.id === jobId);
  }).filter(Boolean);
  if (!savedJobs.length) { grid.innerHTML = ""; noMsg.classList.remove("hidden"); return; }
  noMsg.classList.add("hidden");
  grid.innerHTML = savedJobs.map(j => jobCardHTML(j)).join("");
}
function renderProfileForm(user) {
  document.getElementById("profile-name").value = user.name || "";
  document.getElementById("profile-email").value = user.email || "";
  document.getElementById("profile-phone").value = user.phone || "";
  document.getElementById("profile-location").value = user.location || "";
  document.getElementById("profile-skills").value = user.skills || "";
  document.getElementById("profile-bio").value = user.bio || "";
}
function saveProfile(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) return;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  users[idx].name = document.getElementById("profile-name").value;
  users[idx].phone = document.getElementById("profile-phone").value;
  users[idx].location = document.getElementById("profile-location").value;
  users[idx].skills = document.getElementById("profile-skills").value;
  users[idx].bio = document.getElementById("profile-bio").value;
  saveUsers(users);
  showToast("Profile saved!", "success");
}



function renderAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") { navigateTo("home"); showToast("Admin access only.", "error"); return; }
  const jobs = getJobs();
  const apps = getApplications();
  document.getElementById("admin-stats").innerHTML = `
    <div class="stat-card"><div class="stat-icon">💼</div><div class="stat-value">${jobs.length}</div><div class="stat-label">Total Jobs</div></div>
    <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-value">${apps.length}</div><div class="stat-label">Applications</div></div>
    <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">${getUsers().length}</div><div class="stat-label">Users</div></div>
    <div class="stat-card"><div class="stat-icon">⏳</div><div class="stat-value">${apps.filter(a=>a.status==="Pending").length}</div><div class="stat-label">Pending</div></div>`;
  const tbody = document.getElementById("admin-jobs-tbody");
  tbody.innerHTML = jobs.map(j => {
    const jobApps = apps.filter(a => a.jobId === j.id).length;
    return `<tr>
      <td><strong>${j.title}</strong></td>
      <td>${j.company}</td>
      <td>${j.category}</td>
      <td><span class="tag type">${j.type}</span></td>
      <td><span style="color:var(--primary-light);font-weight:700">${jobApps}</span></td>
      <td><div class="admin-actions">
        <button class="btn btn-ghost btn-sm admin-view-apps-btn" onclick="viewJobApplications('${j.id}')">👥 Apps</button>
        <button class="btn btn-ghost btn-sm" onclick="openEditJob('${j.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteJob('${j.id}')">Delete</button>
      </div></td>
    </tr>`;
  }).join("");
}
function deleteJob(jobId) {
  if (!confirm("Delete this job posting?")) return;
  let jobs = getJobs().filter(j => j.id !== jobId);
  saveJobs(jobs);
  showToast("Job deleted.", "info");
  renderAdmin();
}
function viewJobApplications(jobId) {
  const job = getJobs().find(j => j.id === jobId);
  if (!job) return;
  const apps = getApplications().filter(a => a.jobId === jobId);
  document.getElementById("admin-apps-modal-title").textContent = `Applications: ${job.title}`;
  document.getElementById("admin-apps-modal-sub").textContent = `${job.company} · ${apps.length} applicant${apps.length !== 1 ? "s" : ""}`;
  const list = document.getElementById("admin-apps-list");
  if (!apps.length) {
    list.innerHTML = `<div class="no-results"><div class="no-results-icon">📋</div><h3>No applications yet</h3><p>Nobody has applied to this job yet.</p></div>`;
  } else {
    list.innerHTML = apps.map(a => `<div class="app-manage-card">
      <div class="app-manage-info">
        <div class="app-applicant">${a.name}</div>
        <div class="app-detail">${a.email}${a.phone ? " · " + a.phone : ""} · Applied on ${a.appliedOn}</div>
        ${a.cover ? `<div class="app-detail" style="margin-top:6px;font-style:italic;">"${a.cover.substring(0,120)}${a.cover.length>120?"…":""}"</div>` : ""}
        ${a.resume ? `<div class="app-detail" style="margin-top:4px;"><a href="${a.resume}" target="_blank" style="color:var(--primary-light);">📎 View Resume</a></div>` : ""}
      </div>
      <div class="app-manage-actions">
        <span class="app-status status-${a.status.toLowerCase()}">${a.status}</span>
        ${a.status !== "Accepted" ? `<button class="btn-accept" onclick="updateApplicationStatus('${a.id}','Accepted','${jobId}')">✓ Accept</button>` : ""}
        ${a.status !== "Rejected" ? `<button class="btn-reject" onclick="updateApplicationStatus('${a.id}','Rejected','${jobId}')">✗ Reject</button>` : ""}
      </div>
    </div>`).join("");
  }
  document.getElementById("admin-apps-modal").classList.add("open");
}
function updateApplicationStatus(appId, status, jobId) {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === appId);
  if (idx === -1) return;
  apps[idx].status = status;
  saveApplications(apps);
  showToast(`Application marked as ${status}!`, status === "Accepted" ? "success" : "info");
  viewJobApplications(jobId);
}


let editJobId = null;
function openAddJob() {
  editJobId = null;
  document.getElementById("job-modal-title").textContent = "Post New Job";
  document.getElementById("job-submit-btn").textContent = "Post Job";
  document.getElementById("job-form").reset();
  document.getElementById("job-modal").classList.add("open");
}
function openEditJob(jobId) {
  editJobId = jobId;
  const job = getJobs().find(j => j.id === jobId);
  if (!job) return;
  document.getElementById("job-modal-title").textContent = "Edit Job";
  document.getElementById("job-submit-btn").textContent = "Save Changes";
  document.getElementById("jf-title").value = job.title;
  document.getElementById("jf-company").value = job.company;
  document.getElementById("jf-location").value = job.location;
  document.getElementById("jf-salary").value = job.salary;
  document.getElementById("jf-type").value = job.type;
  document.getElementById("jf-category").value = job.category;
  document.getElementById("jf-experience").value = job.experience;
  document.getElementById("jf-deadline").value = job.deadline || "";
  document.getElementById("jf-description").value = job.description;
  document.getElementById("jf-requirements").value = (job.requirements || []).join("\n");
  document.getElementById("jf-skills").value = (job.skills || []).join(", ");
  document.getElementById("job-modal").classList.add("open");
}
function handleJobForm(e) {
  e.preventDefault();
  const jobs = getJobs();
  const jobData = {
    title: document.getElementById("jf-title").value.trim(),
    company: document.getElementById("jf-company").value.trim(),
    location: document.getElementById("jf-location").value.trim(),
    salary: document.getElementById("jf-salary").value.trim() || "Not disclosed",
    salaryNum: 0,
    type: document.getElementById("jf-type").value,
    category: document.getElementById("jf-category").value,
    experience: document.getElementById("jf-experience").value,
    deadline: document.getElementById("jf-deadline").value,
    description: document.getElementById("jf-description").value.trim(),
    requirements: document.getElementById("jf-requirements").value.split("\n").map(r=>r.trim()).filter(Boolean),
    skills: document.getElementById("jf-skills").value.split(",").map(s=>s.trim()).filter(Boolean),
    featured: false,
  };
  if (editJobId) {
    const idx = jobs.findIndex(j => j.id === editJobId);
    jobs[idx] = { ...jobs[idx], ...jobData };
    saveJobs(jobs);
    showToast("Job updated!", "success");
  } else {
    jobData.id = generateId();
    jobData.posted = new Date().toISOString().split("T")[0];
    jobs.unshift(jobData);
    saveJobs(jobs);
    showToast("Job posted!", "success");
  }
  document.getElementById("job-modal").classList.remove("open");
  renderAdmin();
}


function initTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-content-" + tab).classList.add("active");
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  updateNavForAuth();
  renderHome();
  initTabs();

  
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.dataset.page;
      if ((page === "dashboard" || page === "admin") && !getCurrentUser()) {
        openAuthModal("login"); return;
      }
      navigateTo(page);
    });
  });
  document.getElementById("logo-btn").addEventListener("click", e => { e.preventDefault(); navigateTo("home"); });

  
  document.getElementById("hero-search-btn").addEventListener("click", () => {
    const q = document.getElementById("hero-search-input").value;
    const loc = document.getElementById("hero-location-input").value;
    navigateTo("jobs");
    setTimeout(() => {
      document.getElementById("filter-search").value = q;
      document.getElementById("filter-location").value = loc;
      applyFilters();
    }, 100);
  });
  document.getElementById("view-all-btn").addEventListener("click", () => navigateTo("jobs"));

  
  document.getElementById("login-btn")?.addEventListener("click", () => openAuthModal("login"));
  document.getElementById("register-btn")?.addEventListener("click", () => openAuthModal("register"));
  document.getElementById("close-auth-modal").addEventListener("click", closeAuthModal);
  document.getElementById("login-tab-btn").addEventListener("click", switchToLogin);
  document.getElementById("register-tab-btn").addEventListener("click", switchToRegister);
  document.getElementById("switch-to-register").addEventListener("click", e => { e.preventDefault(); switchToRegister(); });
  document.getElementById("switch-to-login").addEventListener("click", e => { e.preventDefault(); switchToLogin(); });
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("register-form").addEventListener("submit", handleRegister);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);

  
  document.getElementById("apply-filters-btn").addEventListener("click", applyFilters);
  document.getElementById("clear-filters-btn").addEventListener("click", clearFilters);
  document.getElementById("sort-jobs").addEventListener("change", applyFilters);
  document.getElementById("filter-search").addEventListener("input", applyFilters);

  
  document.getElementById("close-apply-modal").addEventListener("click", () => {
    document.getElementById("apply-modal").classList.remove("open");
  });
  document.getElementById("apply-form").addEventListener("submit", handleApply);

  
  document.getElementById("add-job-btn").addEventListener("click", openAddJob);
  document.getElementById("close-job-modal").addEventListener("click", () => {
    document.getElementById("job-modal").classList.remove("open");
  });
  document.getElementById("cancel-job-btn").addEventListener("click", () => {
    document.getElementById("job-modal").classList.remove("open");
  });
  document.getElementById("job-form").addEventListener("submit", handleJobForm);

  
  document.getElementById("profile-form").addEventListener("submit", saveProfile);
  
  
  document.getElementById("close-admin-apps-modal").addEventListener("click", () => {
    document.getElementById("admin-apps-modal").classList.remove("open");
  });

 
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });

  
  const hamburger = document.getElementById("hamburger");
  hamburger.addEventListener("click", () => {
    document.getElementById("nav-links").classList.toggle("open");
    document.getElementById("nav-actions").classList.toggle("open");
  });

  
  const user = getCurrentUser();
  document.getElementById("nav-dashboard").style.display = user ? "" : "none";
  document.getElementById("nav-admin").style.display = (user && user.role === "admin") ? "" : "none";
});

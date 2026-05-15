
function openAuthModal(tab = "login") {
  const modal = document.getElementById("auth-modal");
  modal.classList.add("open");
  if (tab === "register") switchToRegister();
  else switchToLogin();
}
function closeAuthModal() {
  document.getElementById("auth-modal").classList.remove("open");
}
function switchToLogin() {
  document.getElementById("login-form-section").classList.add("active");
  document.getElementById("register-form-section").classList.remove("active");
  document.getElementById("login-tab-btn").classList.add("active");
  document.getElementById("register-tab-btn").classList.remove("active");
}
function switchToRegister() {
  document.getElementById("register-form-section").classList.add("active");
  document.getElementById("login-form-section").classList.remove("active");
  document.getElementById("register-tab-btn").classList.add("active");
  document.getElementById("login-tab-btn").classList.remove("active");
}
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errEl = document.getElementById("login-error");
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    errEl.textContent = "Invalid email or password.";
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");
  setCurrentUser(user.id);
  closeAuthModal();
  updateNavForAuth();
  showToast("Welcome back, " + user.name + "!", "success");
  if (user.role === "admin") navigateTo("admin");
  else navigateTo("dashboard");
}
function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;
  const errEl = document.getElementById("register-error");
  if (password.length < 6) {
    errEl.textContent = "Password must be at least 6 characters.";
    errEl.classList.remove("hidden");
    return;
  }
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    errEl.textContent = "Email already registered.";
    errEl.classList.remove("hidden");
    return;
  }
  const newUser = { id: "u" + Date.now(), name, email, password, role, phone: "", location: "", skills: "", bio: "" };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser.id);
  closeAuthModal();
  updateNavForAuth();
  showToast("Account created! Welcome, " + name + "!", "success");
  navigateTo("dashboard");
}
function handleLogout() {
  logoutUser();
  updateNavForAuth();
  showToast("Logged out successfully.", "info");
  navigateTo("home");
}
function updateNavForAuth() {
  const user = getCurrentUser();
  const actions = document.getElementById("nav-actions");
  if (user) {
    actions.innerHTML = `<span style="color:var(--text-muted);font-size:.875rem;font-weight:600">Hi, ${user.name.split(" ")[0]}</span>
      <button class="btn btn-ghost btn-sm" id="logout-nav-btn">Logout</button>`;
    document.getElementById("logout-nav-btn").addEventListener("click", handleLogout);
    document.getElementById("nav-dashboard").style.display = "";
    document.getElementById("nav-admin").style.display = user.role === "admin" ? "" : "none";
  } else {
    actions.innerHTML = `<button class="btn btn-ghost" id="login-btn">Login</button>
      <button class="btn btn-primary" id="register-btn">Sign Up</button>`;
    document.getElementById("login-btn").addEventListener("click", () => openAuthModal("login"));
    document.getElementById("register-btn").addEventListener("click", () => openAuthModal("register"));
    document.getElementById("nav-dashboard").style.display = "none";
    document.getElementById("nav-admin").style.display = "none";
  }
}

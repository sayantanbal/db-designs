const API_BASE = "/freeapi/auth/api?endpoint=";

const statusText = document.getElementById("session-status");
const messageBox = document.getElementById("auth-message");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerSubmit = document.getElementById("register-submit");
const loginSubmit = document.getElementById("login-submit");
const logoutButton = document.getElementById("logout");
const refreshButton = document.getElementById("refresh-user");
const userEmpty = document.getElementById("user-empty");
const userProfile = document.getElementById("user-profile");

const profileFields = {
  username: document.getElementById("profile-username"),
  email: document.getElementById("profile-email"),
  role: document.getElementById("profile-role"),
  id: document.getElementById("profile-id"),
};

function setMessage(type, text) {
  if (!text) {
    messageBox.className = "auth-message";
    messageBox.textContent = "";
    return;
  }

  messageBox.textContent = text;
  messageBox.className = `auth-message is-visible ${type}`;
}

function setStatus(isAuthenticated) {
  statusText.textContent = isAuthenticated
    ? "Session: Authenticated"
    : "Session: Guest";
  document.documentElement.style.setProperty(
    "--auth-warm",
    isAuthenticated ? "#22c55e" : "#f97316",
  );
}

function setProfile(user) {
  if (!user) {
    userEmpty.classList.remove("is-hidden");
    userProfile.classList.add("is-hidden");
    return;
  }

  userEmpty.classList.add("is-hidden");
  userProfile.classList.remove("is-hidden");
  profileFields.username.textContent = user.username || "-";
  profileFields.email.textContent = user.email || "-";
  profileFields.role.textContent = user.role || "-";
  profileFields.id.textContent = user._id || user.id || "-";
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || "Request failed. Try again.";
    throw new Error(message);
  }

  return payload;
}

async function loadCurrentUser(showSuccess = false) {
  try {
    const data = await request("current-user", { method: "GET" });
    const user = data?.data?.user || data?.data || null;
    setProfile(user);
    setStatus(Boolean(user));
    if (showSuccess) {
      setMessage("success", "Profile refreshed successfully.");
    }
  } catch (error) {
    setProfile(null);
    setStatus(false);
    if (showSuccess) {
      setMessage("error", error.message);
    }
  }
}

function setLoading(button, isLoading, label) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Loading..." : label;
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(null, "");

  const formData = new FormData(registerForm);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || "").trim(),
    role: String(formData.get("role") || "ADMIN"),
  };

  if (!payload.email || !payload.username || !payload.password) {
    setMessage("error", "Please fill in all registration fields.");
    return;
  }

  setLoading(registerSubmit, true, "Create Account");

  try {
    await request("register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setMessage("success", "Registration successful. Session created.");
    registerForm.reset();
    await loadCurrentUser();
    switchTab("login");
  } catch (error) {
    setMessage("error", error.message);
  } finally {
    setLoading(registerSubmit, false, "Create Account");
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(null, "");

  const formData = new FormData(loginForm);
  const payload = {
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || "").trim(),
  };

  if (!payload.username || !payload.password) {
    setMessage("error", "Please enter your username and password.");
    return;
  }

  setLoading(loginSubmit, true, "Sign In");

  try {
    await request("login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setMessage("success", "Login successful. Session active.");
    loginForm.reset();
    await loadCurrentUser();
  } catch (error) {
    setMessage("error", error.message);
  } finally {
    setLoading(loginSubmit, false, "Sign In");
  }
});

logoutButton.addEventListener("click", async () => {
  setMessage(null, "");
  setLoading(logoutButton, true, "Logout");

  try {
    await request("logout", { method: "POST" });
    setMessage("success", "Logged out successfully.");
    setProfile(null);
    setStatus(false);
  } catch (error) {
    setMessage("error", error.message);
  } finally {
    setLoading(logoutButton, false, "Logout");
  }
});

refreshButton.addEventListener("click", async () => {
  setMessage(null, "");
  setLoading(refreshButton, true, "Refresh Profile");
  await loadCurrentUser(true);
  setLoading(refreshButton, false, "Refresh Profile");
});

function switchTab(target) {
  const tabs = document.querySelectorAll(".auth-tab");
  const forms = document.querySelectorAll(".auth-form");

  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  forms.forEach((form) => {
    const isActive = form.dataset.form === target;
    form.classList.toggle("is-hidden", !isActive);
  });
}

const tabButtons = document.querySelectorAll(".auth-tab");

tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

setMessage(null, "");
loadCurrentUser();

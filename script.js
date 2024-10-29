const API_URL = "https://patience-backend.onrender.com"; // Cambia esta URL por la tuya en Render

// Elementos del DOM
const loginScreen = document.getElementById("login-screen");
const registerScreen = document.getElementById("register-screen");
const homeScreen = document.getElementById("home-screen");
const profileScreen = document.getElementById("profile-screen");
const documentsScreen = document.getElementById("documents-screen");
const chatScreen = document.getElementById("chat-screen");
const iaSpecializedScreen = document.getElementById("ia-specialized-screen");
const adminPanel = document.getElementById("admin-panel");
const userNameHome = document.getElementById("user-name-home");

// Formularios y botones
const loginFormElement = document.getElementById("login-form");
const registerFormElement = document.getElementById("register-form");
const logoutButton = document.getElementById("logout-button");
const profileFormElement = document.getElementById("profile-form");
const chatFormElement = document.getElementById("chat-form");
const createUserFormElement = document.getElementById("create-user-form");

// Variables globales
let currentUser = null;
let authToken = null;

// Función de ayuda para manejar solicitudes con token de autorización
async function authorizedFetch(url, options = {}) {
  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };
  const response = await fetch(url, options);
  if (response.status === 401) {
    alert("Sesión caducada. Por favor, inicia sesión nuevamente.");
    handleLogout();
  }
  return response;
}

// Manejar registro de usuario
async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      alert("Registro exitoso. Por favor, inicia sesión.");
      showLoginScreen();
    } else {
      const data = await response.json();
      alert("Error en el registro: " + data.error);
    }
  } catch (error) {
    console.error("Error en el registro:", error);
  }
}

// Manejar inicio de sesión
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      authToken = data.access_token;
      currentUser = email;
      showHomeScreen();
    } else {
      const data = await response.json();
      alert("Error al iniciar sesión: " + data.error);
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
}

// Manejar cierre de sesión
function handleLogout() {
  authToken = null;
  currentUser = null;
  showLoginScreen();
}

// Mostrar pantalla de inicio
function showHomeScreen() {
  hideAllScreens();
  homeScreen.style.display = "block";
  userNameHome.textContent = currentUser;
}

// Mostrar pantalla de perfil y cargar datos
async function showProfile() {
  hideAllScreens();
  profileScreen.style.display = "block";
  const response = await authorizedFetch(`${API_URL}/profile`);
  if (response.ok) {
    const data = await response.json();
    document.getElementById("full-name").value = data.full_name || "";
    document.getElementById("profile-email").value = data.email || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("study-time").value = data.study_hours || "";
    document.getElementById("specialty").value = data.specialty || "";
    document.getElementById("hobbies").value = data.hobbies || "";
    document.getElementById("location").value = data.location || "";
  } else {
    alert("Error al cargar perfil.");
  }
}

// Manejar actualización de perfil
async function handleProfileUpdate(event) {
  event.preventDefault();

  const profileData = {
    full_name: document.getElementById("full-name").value,
    phone: document.getElementById("phone").value,
    study_hours: document.getElementById("study-time").value,
    specialty: document.getElementById("specialty").value,
    hobbies: document.getElementById("hobbies").value,
    location: document.getElementById("location").value,
  };

  const response = await authorizedFetch(`${API_URL}/profile`, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });

  if (response.ok) {
    alert("Perfil actualizado con éxito.");
  } else {
    alert("Error al actualizar perfil.");
  }
}

// Manejar envío de mensaje en el chat con IA
async function handleChatSend(event) {
  event.preventDefault();
  const message = document.getElementById("chat-input").value;
  document.getElementById("chat-input").value = "";

  const response = await authorizedFetch(`${API_URL}/chatgpt`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  if (response.ok) {
    const data = await response.json();
    addMessageToChat("user", message);
    addMessageToChat("assistant", data.response);
  } else {
    alert("Error en el chat con IA.");
  }
}

// Agregar mensajes al chat
function addMessageToChat(role, content) {
  const chatMessagesContainer = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", role);
  messageElement.textContent = content;
  chatMessagesContainer.appendChild(messageElement);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Mostrar pantalla de administración y cargar usuarios
async function showAdminPanel() {
  hideAllScreens();
  adminPanel.style.display = "block";
  const response = await authorizedFetch(`${API_URL}/admin/users`);
  if (response.ok) {
    const users = await response.json();
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${user.name}</td><td>${user.email}</td><td>${user.registeredAt}</td>`;
      userList.appendChild(row);
    });
  } else {
    alert("Error al cargar usuarios.");
  }
}

// Ocultar todas las pantallas
function hideAllScreens() {
  const screens = document.querySelectorAll(".card");
  screens.forEach((screen) => (screen.style.display = "none"));
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  if (loginFormElement) loginFormElement.addEventListener("submit", handleLogin);
  if (registerFormElement) registerFormElement.addEventListener("submit", handleRegister);
  if (logoutButton) logoutButton.addEventListener("click", handleLogout);
  if (profileFormElement) profileFormElement.addEventListener("submit", handleProfileUpdate);
  if (chatFormElement) chatFormElement.addEventListener("submit", handleChatSend);
});

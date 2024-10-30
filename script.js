// URL del backend (asegúrate de que esta URL es correcta)
const API_URL = "https://patience-backend.onrender.com";

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
const newsScreen = document.getElementById("news-screen");
const directoryScreen = document.getElementById("directory-screen");
const guideScreen = document.getElementById("guide-screen");
const groupsScreen = document.getElementById("groups-screen");
const helpScreen = document.getElementById("help-screen");
const centerScreen = document.getElementById("center-screen");

// Formularios y botones
const loginFormElement = document.getElementById("login-form");
const registerFormElement = document.getElementById("register-form");
const logoutButton = document.getElementById("logout-button");
const profileFormElement = document.getElementById("profile-form");
const chatFormElement = document.getElementById("chat-form");
const createUserFormElement = document.getElementById("create-user-form");
const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const helpButton = document.getElementById("help-button");
const logoButton = document.getElementById("logo");

// Botones del menú
const inicioButton = document.getElementById("inicio-button");
const perfilButton = document.getElementById("perfil-button");
const iaButton = document.getElementById("ia-button");
const gruposButton = document.getElementById("grupos-button");
const documentosButton = document.getElementById("documentos-button");
const centroButton = document.getElementById("centro-button");
const noticiasButton = document.getElementById("noticias-button");
const adminButton = document.getElementById("admin-button");

// Botones adicionales
const guideButton = document.getElementById("guide-button");
const directoryButton = document.getElementById("directory-button");
const slackButton = document.getElementById("slack-button");
const slackButtonGroups = document.getElementById("slack-button-groups");
const csifButton = document.getElementById("csif-button");
const sipriButton = document.getElementById("sipri-button");

// Variables globales
let currentUser = null;
let authToken = null;
let conversation = []; // Historial de conversación
let selectedSpecialty = ""; // Especialidad seleccionada

// Función de ayuda para manejar solicitudes con token de autorización
async function authorizedFetch(url, options = {}) {
    options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${authToken}`,
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
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            alert("Registro exitoso. Por favor, inicia sesión.");
            showLoginScreen();
        } else {
            const data = await response.json();
            alert("Error en el registro: " + (data.error || "Inténtalo de nuevo más tarde."));
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Error en el registro. Por favor, verifica tu conexión e inténtalo de nuevo.");
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
            currentUser = data.username || email;
            showHomeScreen();
        } else {
            const data = await response.json();
            alert("Error al iniciar sesión: " + (data.error || "Inténtalo de nuevo más tarde."));
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión. Por favor, verifica tu conexión e inténtalo de nuevo.");
    }
}

// Manejar cierre de sesión
function handleLogout() {
    authToken = null;
    currentUser = null;
    hideHeaderAndMenu();
    showLoginScreen();
}

// Mostrar pantalla de inicio
function showHomeScreen() {
    hideAllScreens();
    if (homeScreen) {
        homeScreen.style.display = "block";
        if (userNameHome) {
            userNameHome.textContent = currentUser;
        }
        showHeaderAndMenu();
    }
}

// Mostrar pantalla de perfil y cargar datos
async function showProfile() {
    hideAllScreens();
    if (profileScreen) {
        profileScreen.style.display = "block";
        try {
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
        } catch (error) {
            console.error("Error al cargar perfil:", error);
            alert("Error al cargar perfil. Por favor, inténtalo de nuevo más tarde.");
        }
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

    try {
        const response = await authorizedFetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
        });

        if (response.ok) {
            alert("Perfil actualizado con éxito.");
        } else {
            alert("Error al actualizar perfil.");
        }
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        alert("Error al actualizar perfil. Por favor, inténtalo de nuevo más tarde.");
    }
}

// Manejar cambio de imagen de perfil
function handleProfileImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        // Mostrar la imagen seleccionada en el frontend
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profile-img").src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Enviar la imagen al backend
        const formData = new FormData();
        formData.append('profile_image', file);

        fetch(`${API_URL}/upload_profile_image`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then(response => {
            if (response.ok) {
                alert("Imagen de perfil actualizada con éxito.");
            } else {
                alert("Error al actualizar la imagen de perfil.");
            }
        })
        .catch(error => {
            console.error("Error al actualizar la imagen de perfil:", error);
            alert("Error al actualizar la imagen de perfil. Por favor, inténtalo de nuevo más tarde.");
        });
    }
}

// Mostrar pantalla de IA especializada
function showIASpecialized() {
    hideAllScreens();
    if (iaSpecializedScreen) {
        iaSpecializedScreen.style.display = "block";
    }
}

// Manejar selección de especialidad y mostrar chat
function handleSpecialtySelection(specialty) {
    hideAllScreens();
    if (chatScreen) {
        chatScreen.style.display = "block";
        const chatTitle = document.getElementById("chat-title");
        if (chatTitle) {
            chatTitle.textContent = `Chat con IA Especializada en ${specialty}`;
        }
        // Reiniciar conversación al cambiar de especialidad
        conversation = [];
        clearChatMessages();
        selectedSpecialty = specialty;
    }
}

// Manejar envío de mensaje en el chat con IA
async function handleChatSend(event) {
    event.preventDefault();
    const chatInput = document.getElementById("chat-input");
    if (chatInput) {
        const messageContent = chatInput.value.trim();
        if (messageContent === "") return;

        chatInput.value = "";

        // Agregar mensaje del usuario al historial y mostrarlo
        const userMessage = { role: "user", content: messageContent };
        conversation.push(userMessage);
        addMessageToChat("user", messageContent);

        try {
            const response = await authorizedFetch(`${API_URL}/chatgpt`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: conversation, specialty: selectedSpecialty }),
            });

            if (response.ok) {
                const data = await response.json();
                const assistantMessageContent = data.assistant_message;

                // Agregar respuesta de la IA al historial y mostrarla
                const assistantMessage = { role: "assistant", content: assistantMessageContent };
                conversation.push(assistantMessage);
                addMessageToChat("assistant", assistantMessageContent);
            } else {
                alert("Error en el chat con IA.");
            }
        } catch (error) {
            console.error("Error en el chat con IA:", error);
            alert("Error en el chat con IA. Por favor, inténtalo de nuevo más tarde.");
        }
    }
}

// Agregar mensajes al chat
function addMessageToChat(role, content) {
    const chatMessagesContainer = document.getElementById("chat-messages");
    if (chatMessagesContainer) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", role);
        messageElement.textContent = content;
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
}

// Limpiar mensajes del chat
function clearChatMessages() {
    const chatMessagesContainer = document.getElementById("chat-messages");
    if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = "";
    }
}

// Manejar limpieza del chat
function handleClearChat() {
    conversation = [];
    clearChatMessages();
    alert("Se ha iniciado una nueva conversación.");
}

// Mostrar pantalla de noticias
function showNews() {
    hideAllScreens();
    if (newsScreen) {
        newsScreen.style.display = "block";
    }
}

// Mostrar pantalla de directorio
function showDirectory() {
    hideAllScreens();
    if (directoryScreen) {
        directoryScreen.style.display = "block";
    }
}

// Mostrar pantalla de guía
function showGuide() {
    hideAllScreens();
    if (guideScreen) {
        guideScreen.style.display = "block";
    }
}

// Mostrar pantalla de ayuda
function showHelp() {
    hideAllScreens();
    if (helpScreen) {
        helpScreen.style.display = "block";
    }
}

// Mostrar pantalla de mi centro
function showCenter() {
    hideAllScreens();
    if (centerScreen) {
        centerScreen.style.display = "block";
    }
}

// Mostrar pantalla de administración y cargar usuarios
async function showAdminPanel() {
    hideAllScreens();
    if (adminPanel) {
        adminPanel.style.display = "block";
        try {
            const response = await authorizedFetch(`${API_URL}/admin/users`);
            if (response.ok) {
                const users = await response.json();
                const userList = document.getElementById("user-list");
                if (userList) {
                    userList.innerHTML = "";
                    users.forEach((user) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `<td>${user.username}</td><td>${user.email}</td><td>${user.registeredAt}</td>`;
                        userList.appendChild(row);
                    });
                }
            } else {
                alert("Error al cargar usuarios.");
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            alert("Error al cargar usuarios. Por favor, inténtalo de nuevo más tarde.");
        }
    }
}

// Mostrar pantalla de documentos
function showDocuments() {
    hideAllScreens();
    if (documentsScreen) {
        documentsScreen.style.display = "block";
    }
}

// Mostrar pantalla de grupos
function showGroups() {
    hideAllScreens();
    if (groupsScreen) {
        groupsScreen.style.display = "block";
    }
}

// Mostrar header y menú
function showHeaderAndMenu() {
    const header = document.querySelector("header");
    const menu = document.getElementById("menu-desplegable");
    if (header) header.style.display = "flex";
    if (menu) menu.style.display = "flex";
}

// Ocultar header y menú
function hideHeaderAndMenu() {
    const header = document.querySelector("header");
    const menu = document.getElementById("menu-desplegable");
    if (header) header.style.display = "none";
    if (menu) menu.style.display = "none";
}

// Ocultar todas las pantallas
function hideAllScreens() {
    const screens = document.querySelectorAll(".card");
    screens.forEach((screen) => (screen.style.display = "none"));
}

// Funciones para mostrar pantallas de registro e inicio de sesión
function showRegisterScreen() {
    hideAllScreens();
    if (registerScreen) {
        registerScreen.style.display = "block";
    }
}

function showLoginScreen() {
    hideAllScreens();
    if (loginScreen) {
        loginScreen.style.display = "block";
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    if (loginFormElement) {
        loginFormElement.addEventListener("submit", handleLogin);
    }
    if (registerFormElement) {
        registerFormElement.addEventListener("submit", handleRegister);
    }
    if (logoutButton) logoutButton.addEventListener("click", handleLogout);
    if (profileFormElement) profileFormElement.addEventListener("submit", handleProfileUpdate);
    if (chatFormElement) chatFormElement.addEventListener("submit", handleChatSend);
    if (registerButton) registerButton.addEventListener("click", showRegisterScreen);
    if (loginButton) loginButton.addEventListener("click", showLoginScreen);
    if (helpButton) helpButton.addEventListener("click", showHelp);
    if (logoButton) logoButton.addEventListener("click", showHomeScreen);

    // Botones del menú
    if (inicioButton) inicioButton.addEventListener("click", showHomeScreen);
    if (perfilButton) perfilButton.addEventListener("click", showProfile);
    if (iaButton) iaButton.addEventListener("click", showIASpecialized);
    if (gruposButton) gruposButton.addEventListener("click", showGroups);
    if (documentosButton) documentosButton.addEventListener("click", showDocuments);
    if (centroButton) centroButton.addEventListener("click", showCenter);
    if (noticiasButton) noticiasButton.addEventListener("click", showNews);
    if (adminButton) adminButton.addEventListener("click", showAdminPanel);

    // Botones adicionales
    if (guideButton) guideButton.addEventListener("click", showGuide);
    if (directoryButton) directoryButton.addEventListener("click", showDirectory);
    if (slackButton) slackButton.addEventListener("click", () => {
        window.open("https://slack.com", "_blank");
    });
    if (slackButtonGroups) slackButtonGroups.addEventListener("click", () => {
        window.open("https://slack.com", "_blank");
    });
    if (csifButton) csifButton.addEventListener("click", () => {
        const csifIframe = document.getElementById("csif-iframe");
        const sipriIframe = document.getElementById("sipri-iframe");
        if (csifIframe && sipriIframe) {
            csifIframe.style.display = "block";
            sipriIframe.style.display = "none";
        }
    });
    if (sipriButton) sipriButton.addEventListener("click", () => {
        const csifIframe = document.getElementById("csif-iframe");
        const sipriIframe = document.getElementById("sipri-iframe");
        if (csifIframe && sipriIframe) {
            sipriIframe.style.display = "block";
            csifIframe.style.display = "none";
        }
    });

    // Botones de especialidades
    const biologiaButton = document.getElementById("biologia-button");
    const inglesButton = document.getElementById("ingles-button");
    const lenguaButton = document.getElementById("lengua-button");
    const matematicasButton = document.getElementById("matematicas-button");

    if (biologiaButton) biologiaButton.addEventListener("click", () => handleSpecialtySelection("Biología y Geología"));
    if (inglesButton) inglesButton.addEventListener("click", () => handleSpecialtySelection("Inglés"));
    if (lenguaButton) lenguaButton.addEventListener("click", () => handleSpecialtySelection("Lengua Castellana y Literatura"));
    if (matematicasButton) matematicasButton.addEventListener("click", () => handleSpecialtySelection("Matemáticas"));

    // Botón para limpiar el chat
    const clearChatButton = document.getElementById("clear-chat-button");
    if (clearChatButton) clearChatButton.addEventListener("click", handleClearChat);

    // Manejar cambio de imagen de perfil
    const profileImageInput = document.getElementById("profile-image-input");
    if (profileImageInput) {
        profileImageInput.addEventListener("change", handleProfileImageChange);
    }

    // Mostrar pantalla de inicio de sesión al cargar la aplicación
    showLoginScreen();
});

// script.js

// Importaciones al nivel superior usando el Modular SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updatePassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  addDoc,
  query,
  where,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-functions.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDpCwvvgd047aMQj3wvnGZRULklq04OqKM",
  authDomain: "patience-b1063.firebaseapp.com",
  projectId: "patience-b1063",
  storageBucket: "patience-b1063.appspot.com",
  messagingSenderId: "733466730686",
  appId: "1:733466730686:web:de1e1f8fa8783491ecbeef",
  measurementId: "G-TD50WYPDTC",
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const functions = getFunctions();

// Variable global para almacenar el usuario actual
let currentUser = null;

// Variable global para la especialidad seleccionada
let currentSpecialty = null;

// Variable global para el historial de chat
let chatHistory = [];

// Referencias a elementos del DOM
const loginScreen = document.getElementById("login-screen");
const registerScreen = document.getElementById("register-screen");
const homeScreen = document.getElementById("home-screen");
const profileScreen = document.getElementById("profile-screen");
const adminPanel = document.getElementById("admin-panel");
const iaSpecializedScreen = document.getElementById("ia-specialized-screen");
const chatScreen = document.getElementById("chat-screen");
const guideScreen = document.getElementById("guide-screen");
const directoryScreen = document.getElementById("directory-screen");
const documentsScreen = document.getElementById("documents-screen");
const groupsScreen = document.getElementById("groups-screen");
const newsScreen = document.getElementById("news-screen");
const helpScreen = document.getElementById("help-screen");
const trainingScreen = document.getElementById("training-screen");
const comingSoonScreen = document.getElementById("coming-soon-screen");
const passwordChangePopup = document.getElementById("password-change-popup");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const userNameHome = document.getElementById("user-name-home");

// Botones de navegación
const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");
const logoutButton = document.getElementById("logout-button");
const iaButton = document.getElementById("ia-button");
const inicioButton = document.getElementById("inicio-button");
const perfilButton = document.getElementById("perfil-button");
const gruposButton = document.getElementById("grupos-button");
const documentosButton = document.getElementById("documentos-button");
const centroButton = document.getElementById("centro-button");
const noticiasButton = document.getElementById("noticias-button");
const adminButton = document.getElementById("admin-button");

// Botones dentro de pantallas específicas
const iaSpecializedButtons = {
  biologia: document.getElementById("biologia-button"),
  ingles: document.getElementById("ingles-button"),
  lengua: document.getElementById("lengua-button"),
  matematicas: document.getElementById("matematicas-button"),
};

// Formularios
const loginFormElement = document.getElementById("login-form");
const registerFormElement = document.getElementById("register-form");
const passwordChangeFormElement = document.getElementById("password-change-form");
const profileFormElement = document.getElementById("profile-form");
const createUserFormElement = document.getElementById("create-user-form");
const chatFormElement = document.getElementById("chat-form");

// Otros elementos
const testButton = document.getElementById("test-button");

// Inicializar el historial de chat desde Firestore
async function initializeChatHistory(specialty) {
  currentSpecialty = specialty;
  chatHistory = []; // Reiniciar el historial

  // Llamar a la función getChatHistory desde Firebase Functions
  const getChatHistoryFunction = httpsCallable(functions, "getChatHistory");
  try {
    const result = await getChatHistoryFunction({ specialty: specialty });
    const messages = result.data.messages;
    if (messages && Array.isArray(messages)) {
      chatHistory = messages;
      messages.forEach((msg) => {
        addMessageToChat(msg.role, msg.content);
      });
    }
  } catch (error) {
    console.error("Error al obtener el historial de chat:", error);
    alert("No se pudo cargar el historial de chat.");
  }
}

// Event Listener al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const profileIcon = document.getElementById("profile-icon");
  const dropdown = document.getElementById("profile-dropdown");

  // Mostrar u ocultar el menú desplegable del perfil
  if (profileIcon && dropdown) {
    profileIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdown.classList.toggle("show-dropdown");
    });

    // Cerrar el dropdown si se hace clic fuera de él
    document.addEventListener("click", (event) => {
      if (
        !profileIcon.contains(event.target) &&
        !dropdown.contains(event.target)
      ) {
        dropdown.classList.remove("show-dropdown");
      }
    });
  }

  // Event listeners para botones del menú
  if (inicioButton) inicioButton.addEventListener("click", showHomeScreen);
  if (perfilButton) perfilButton.addEventListener("click", showProfile);
  if (iaButton) iaButton.addEventListener("click", showIASpecializedOptions);
  if (gruposButton) gruposButton.addEventListener("click", showGroups);
  if (documentosButton) documentosButton.addEventListener("click", showDocuments);
  if (centroButton) centroButton.addEventListener("click", showComingSoon);
  if (noticiasButton) noticiasButton.addEventListener("click", showNews);
  if (adminButton) adminButton.addEventListener("click", showAdminPanel);

  // Event listeners para botones dentro de pantallas específicas
  for (const [key, button] of Object.entries(iaSpecializedButtons)) {
    if (button) {
      button.addEventListener("click", () => {
        redirectToIA(key);
      });
    }
  }

  // Event listeners para botones de navegación entre pantallas
  if (registerButton) registerButton.addEventListener("click", showRegisterScreen);
  if (loginButton) loginButton.addEventListener("click", showLoginScreen);

  // Event listeners para botones de Slack
  const slackButton = document.getElementById("slack-button");
  if (slackButton)
    slackButton.addEventListener("click", () =>
      redirectToURL(
        "https://join.slack.com/t/patienceespacio/shared_invite/zt-1v8qj5xip-1Tc4qYv~oOx3xJp9jEq8pg"
      )
    );

  const slackButtonGroups = document.getElementById("slack-button-groups");
  if (slackButtonGroups)
    slackButtonGroups.addEventListener("click", () =>
      redirectToURL(
        "https://join.slack.com/t/patienceespacio/shared_invite/zt-1v8qj5xip-1Tc4qYv~oOx3xJp9jEq8pg"
      )
    );

  const slackButtonHelp = document.getElementById("slack-button-help");
  if (slackButtonHelp)
    slackButtonHelp.addEventListener("click", () =>
      redirectToURL(
        "https://join.slack.com/t/patienceespacio/shared_invite/zt-1v8qj5xip-1Tc4qYv~oOx3xJp9jEq8pg"
      )
    );

  // Event listeners para la sección de ayuda
  const faqsButton = document.getElementById("faqs-button");
  if (faqsButton)
    faqsButton.addEventListener("click", () => toggleSection("faqs-section"));

  const contactButton = document.getElementById("contact-button");
  if (contactButton)
    contactButton.addEventListener("click", () =>
      toggleSection("contact-section")
    );

  // Event listener para el botón "¿Qué es Patience?" en el menú de ayuda
  const trainingButtonHelp = document.getElementById("training-button-help");
  if (trainingButtonHelp)
    trainingButtonHelp.addEventListener("click", showTraining);

  // Event listeners para noticias
  const csifButton = document.getElementById("csif-button");
  if (csifButton)
    csifButton.addEventListener("click", () => showNewsContent("csif"));

  const sipriButton = document.getElementById("sipri-button");
  if (sipriButton)
    sipriButton.addEventListener("click", () => showNewsContent("sipri"));

  // Manejo del formulario de inicio de sesión
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", handleLogin);
  }

  // Manejo del formulario de registro
  if (registerFormElement) {
    registerFormElement.addEventListener("submit", handleRegister);
  }

  // Manejo del formulario de cambio de contraseña
  if (passwordChangeFormElement) {
    passwordChangeFormElement.addEventListener("submit", handlePasswordChange);
  }

  // Manejo del formulario de perfil
  if (profileFormElement) {
    profileFormElement.addEventListener("submit", handleProfileUpdate);
  }

  // Manejo del formulario de crear usuario (panel de administración)
  if (createUserFormElement) {
    createUserFormElement.addEventListener("submit", createNewUser);
  }

  // Manejo de la imagen de perfil
  const profileImageInput = document.getElementById("profile-image-input");
  if (profileImageInput) {
    profileImageInput.addEventListener("change", handleImageUpload);
  }

  // Manejo del logo para volver al inicio
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", handleLogoClick);
  }

  // Event listener para el botón de crear carpeta en documentos
  const createFolderButton = document.getElementById("create-folder-button");
  if (createFolderButton)
    createFolderButton.addEventListener("click", createFolder);

  // Manejo del formulario de chat
  if (chatFormElement) {
    chatFormElement.addEventListener("submit", handleChatSend);
  }
});

// Función para manejar el registro de usuarios
async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Enviar correo de verificación
    await sendEmailVerification(user);

    // Almacenar información adicional del usuario en Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      profile: {},
      role: "user",
      registeredAt: new Date().toISOString(),
      temporaryPassword: false,
    });

    alert(
      "Registro exitoso. Por favor, verifica tu correo electrónico antes de iniciar sesión."
    );
    showLoginScreen();
  } catch (error) {
    console.error("Error al registrar:", error);
    alert("No se pudo completar el registro. " + error.message);
  }
}

// Función para manejar el inicio de sesión
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verificar si el correo electrónico ha sido verificado
    if (!user.emailVerified) {
      alert("Por favor, verifica tu correo electrónico antes de continuar.");
      await sendEmailVerification(user);
      await signOut(auth);
      showLoginScreen();
      return;
    }

    showHomeScreen();
    const menu = document.getElementById("menu-desplegable");
    if (menu) menu.style.display = "flex";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Correo o contraseña incorrectos. " + error.message);
  }
}

// Función para manejar el cambio de contraseña
async function handlePasswordChange(event) {
  event.preventDefault();
  const newPassword = document.getElementById("new-password").value;

  if (newPassword.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  try {
    await updatePassword(auth.currentUser, newPassword);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      temporaryPassword: false,
    });
    alert("Contraseña cambiada con éxito.");
    const passwordChangePopup = document.getElementById("password-change-popup");
    if (passwordChangePopup) {
      passwordChangePopup.style.display = "none";
    }
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    alert("No se pudo cambiar la contraseña.");
  }
}

// Manejar el cierre de sesión
async function handleLogout() {
  try {
    await signOut(auth);
    console.log("Usuario deslogueado");
    currentUser = null;
    showLoginScreen();
    const menu = document.getElementById("menu-desplegable");
    if (menu) menu.style.display = "none";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

// Manejar la actualización del perfil
async function handleProfileUpdate(event) {
  event.preventDefault();

  const profileImgElement = document.getElementById("profile-img");
  const profileData = {
    fullName: document.getElementById("full-name").value,
    phone: document.getElementById("phone").value,
    studyTime: document.getElementById("study-time").value,
    specialty: document.getElementById("specialty").value,
    hobbies: document.getElementById("hobbies").value,
    location: document.getElementById("location").value,
    profileImage: profileImgElement
      ? profileImgElement.src
      : "assets/default-profile.png",
  };

  try {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      profile: profileData,
    });
    alert("Perfil actualizado con éxito");
    updateProfileIcon();
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    alert("No se pudo actualizar el perfil.");
  }
}

// Mostrar la pantalla de registro
function showRegisterScreen() {
  hideAllScreens();
  if (registerScreen) registerScreen.style.display = "block";
  if (header) header.style.display = "none";
  if (footer) footer.style.display = "none";
}

// Mostrar la pantalla de inicio de sesión
function showLoginScreen() {
  hideAllScreens();
  if (loginScreen) loginScreen.style.display = "block";
  if (header) header.style.display = "none";
  if (footer) footer.style.display = "none";
}

// Mostrar la pantalla principal
function showHomeScreen() {
  hideAllScreens();
  if (homeScreen) homeScreen.style.display = "block";
  if (userNameHome && auth.currentUser) {
    userNameHome.textContent =
      auth.currentUser.displayName || auth.currentUser.email;
  }
  if (header) header.style.display = "flex";
  if (footer) footer.style.display = "block";
  const menu = document.getElementById("menu-desplegable");
  if (menu) menu.style.display = "flex";
  updateProfileIcon();
  updateDocumentOverview();
}

// Funciones para mostrar diferentes pantallas
async function showProfile() {
  if (auth.currentUser) {
    hideAllScreens();
    if (profileScreen) profileScreen.style.display = "block";

    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (userDoc.exists()) {
      const profile = userDoc.data().profile || {};
      document.getElementById("full-name").value = profile.fullName || "";
      document.getElementById("profile-email").value = auth.currentUser.email || "";
      document.getElementById("phone").value = profile.phone || "";
      document.getElementById("study-time").value = profile.studyTime || "";
      document.getElementById("specialty").value = profile.specialty || "";
      document.getElementById("hobbies").value = profile.hobbies || "";
      document.getElementById("location").value = profile.location || "";
      const profileImg = document.getElementById("profile-img");
      if (profileImg)
        profileImg.src = profile.profileImage || "assets/default-profile.png";
    }
  } else {
    showLoginScreen();
  }
}

function showGroups() {
  if (auth.currentUser) {
    hideAllScreens();
    if (groupsScreen) groupsScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showIASpecializedOptions() {
  if (auth.currentUser) {
    hideAllScreens();
    if (iaSpecializedScreen) iaSpecializedScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

async function redirectToIA(specialty) {
  if (auth.currentUser) {
    hideAllScreens();
    if (chatScreen) chatScreen.style.display = "block";
    await initializeChatHistory(specialty);
  } else {
    alert("Por favor, inicia sesión para acceder a esta funcionalidad.");
    showLoginScreen();
  }
}

function showTraining() {
  if (auth.currentUser) {
    hideAllScreens();
    if (trainingScreen) trainingScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showComingSoon() {
  if (auth.currentUser) {
    hideAllScreens();
    if (comingSoonScreen) comingSoonScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showNews() {
  if (auth.currentUser) {
    hideAllScreens();
    if (newsScreen) newsScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showDocuments() {
  if (auth.currentUser) {
    hideAllScreens();
    if (documentsScreen) documentsScreen.style.display = "block";
    displayDocuments();
  } else {
    showLoginScreen();
  }
}

function showGuide() {
  if (auth.currentUser) {
    hideAllScreens();
    if (guideScreen) guideScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showDirectory() {
  if (auth.currentUser) {
    hideAllScreens();
    if (directoryScreen) directoryScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showHelp() {
  if (auth.currentUser) {
    hideAllScreens();
    if (helpScreen) helpScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

// Función para ocultar todas las pantallas
function hideAllScreens() {
  const screens = document.querySelectorAll(".card");
  screens.forEach((screen) => (screen.style.display = "none"));
}

// Función para redirigir a una URL externa
function redirectToURL(url) {
  if (auth.currentUser) {
    window.open(url, "_blank");
  } else {
    alert("Por favor, inicia sesión para acceder a esta funcionalidad.");
    showLoginScreen();
  }
}

// Manejar el logo para volver al inicio
function handleLogoClick() {
  if (auth.currentUser) {
    showHomeScreen();
  } else {
    showLoginScreen();
  }
}

// Manejar la imagen de perfil
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file && auth.currentUser) {
    const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const profileImg = document.getElementById("profile-img");
      if (profileImg) {
        profileImg.src = downloadURL;
      }
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        "profile.profileImage": downloadURL,
      });
      updateProfileIcon();
    } catch (error) {
      console.error("Error al subir la imagen de perfil:", error);
      alert("No se pudo subir la imagen de perfil.");
    }
  }
}

// Actualizar el ícono de perfil en el header
async function updateProfileIcon() {
  const profileIcon = document.getElementById("profile-icon");
  if (profileIcon && auth.currentUser) {
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (userDoc.exists()) {
      const profileImage = userDoc.data().profile.profileImage;
      profileIcon.src = profileImage || "assets/default-profile.png";
    }
  }
}

// Mostrar el contenido de noticias
function showNewsContent(newsType) {
  const csifIframe = document.getElementById("csif-iframe");
  const sipriIframe = document.getElementById("sipri-iframe");

  if (csifIframe) csifIframe.style.display = "none";
  if (sipriIframe) sipriIframe.style.display = "none";

  if (newsType === "csif" && csifIframe) {
    csifIframe.style.display = "block";
  } else if (newsType === "sipri" && sipriIframe) {
    sipriIframe.style.display = "block";
  }
}

// Alternar secciones en la pantalla de ayuda
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.style.display =
      section.style.display === "none" || section.style.display === ""
        ? "block"
        : "none";
  }
}

// Manejar la actualización del resumen de documentos en la pantalla principal
async function updateDocumentOverview() {
  const documentList = document.getElementById("document-list");
  if (documentList && auth.currentUser) {
    documentList.innerHTML = "";

    const q = query(
      collection(db, "users", auth.currentUser.uid, "documents"),
      where("lastOpened", "!=", null)
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    if (documents.length === 0) {
      documentList.textContent = "Sin documentos";
    } else {
      const lastOpenedDocuments = documents
        .sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened))
        .slice(0, 2);
      lastOpenedDocuments.forEach((doc) => {
        const docElement = document.createElement("p");
        docElement.textContent = doc.name;
        documentList.appendChild(docElement);
      });
    }
  }
}

// Abrir documento en una nueva pestaña
function openDocument(url) {
  window.open(url, "_blank");
}

// Subir documentos al almacenamiento de Firebase
async function uploadDocuments(event) {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storageRef = ref(storage, `documents/${auth.currentUser.uid}/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Almacenar metadatos en Firestore
      const docData = {
        name: file.name,
        url: downloadURL,
        lastOpened: null,
        folderId: null,
        uploadedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "users", auth.currentUser.uid, "documents"), docData);
      displayDocuments();
      updateDocumentOverview();
    } catch (error) {
      console.error("Error al subir el documento:", error);
      alert("No se pudo subir el documento: " + error.message);
    }
  }
}

// Crear carpeta (puedes expandir esta función para manejar carpetas)
async function createFolder() {
  const folderName = prompt("Nombre de la nueva carpeta:");
  if (folderName && auth.currentUser) {
    const folderData = {
      name: folderName,
      parentId: null,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "folders"), folderData);
      displayDocuments();
      alert("Carpeta creada con éxito.");
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      alert("No se pudo crear la carpeta.");
    }
  }
}

// Mostrar documentos y carpetas
async function displayDocuments() {
  const documentsContainer = document.getElementById("documents-container");
  if (documentsContainer && auth.currentUser) {
    documentsContainer.innerHTML = "";

    // Obtener carpetas raíz
    const foldersSnapshot = await getDocs(
      query(
        collection(db, "users", auth.currentUser.uid, "folders"),
        where("parentId", "==", null)
      )
    );

    foldersSnapshot.forEach((folderDoc) => {
      const folderData = folderDoc.data();
      const folderElement = createFolderElement(folderDoc.id, folderData);
      documentsContainer.appendChild(folderElement);
    });

    // Obtener documentos en la raíz
    const documentsSnapshot = await getDocs(
      query(
        collection(db, "users", auth.currentUser.uid, "documents"),
        where("folderId", "==", null)
      )
    );

    documentsSnapshot.forEach((doc) => {
      const docData = doc.data();
      const docElement = createDocumentElement(doc.id, docData);
      documentsContainer.appendChild(docElement);
    });
  }
}

function createFolderElement(folderId, folderData) {
  const folderElement = document.createElement("div");
  folderElement.classList.add("folder");
  folderElement.innerHTML = `<i class="fas fa-folder"></i> ${folderData.name}`;

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.onclick = async (event) => {
    event.stopPropagation();
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar esta carpeta y todos sus contenidos?"
      )
    ) {
      await deleteFolder(folderId);
    }
  };

  const openButton = document.createElement("button");
  openButton.innerHTML = '<i class="fas fa-folder-open"></i>';
  openButton.onclick = async (event) => {
    event.stopPropagation();
    await openFolder(folderId, folderData.name);
  };

  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("actions-container");
  actionsContainer.appendChild(openButton);
  actionsContainer.appendChild(deleteButton);

  folderElement.appendChild(actionsContainer);
  return folderElement;
}

function createDocumentElement(docId, docData) {
  const docElement = document.createElement("div");
  docElement.classList.add("document");
  docElement.innerHTML = `<i class="fas fa-file"></i> ${docData.name}`;

  docElement.addEventListener("click", async () => {
    // Actualizar la última apertura
    await updateDoc(doc(db, "users", auth.currentUser.uid, "documents", docId), {
      lastOpened: new Date().toISOString(),
    });
    openDocument(docData.url);
    updateDocumentOverview();
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.onclick = async (event) => {
    event.stopPropagation();
    if (confirm("¿Estás seguro de que deseas eliminar este documento?")) {
      await deleteDocument(docId, docData.name);
    }
  };

  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("actions-container");
  actionsContainer.appendChild(deleteButton);

  docElement.appendChild(actionsContainer);
  return docElement;
}

// Abrir carpeta
async function openFolder(folderId, folderName) {
  const documentsContainer = document.getElementById("documents-container");
  if (documentsContainer && auth.currentUser) {
    documentsContainer.innerHTML = "";

    // Botón para regresar a la raíz
    const backButton = document.createElement("button");
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Volver';
    backButton.onclick = displayDocuments;
    documentsContainer.appendChild(backButton);

    // Obtener subcarpetas
    const subFoldersSnapshot = await getDocs(
      query(
        collection(db, "users", auth.currentUser.uid, "folders"),
        where("parentId", "==", folderId)
      )
    );

    subFoldersSnapshot.forEach((folderDoc) => {
      const folderData = folderDoc.data();
      const folderElement = createFolderElement(folderDoc.id, folderData);
      documentsContainer.appendChild(folderElement);
    });

    // Obtener documentos en la carpeta
    const documentsSnapshot = await getDocs(
      query(
        collection(db, "users", auth.currentUser.uid, "documents"),
        where("folderId", "==", folderId)
      )
    );

    documentsSnapshot.forEach((doc) => {
      const docData = doc.data();
      const docElement = createDocumentElement(doc.id, docData);
      documentsContainer.appendChild(docElement);
    });
  }
}

// Eliminar carpeta y sus contenidos
async function deleteFolder(folderId) {
  try {
    // Eliminar documentos dentro de la carpeta
    const docsSnapshot = await getDocs(
      query(
        collection(db, "users", auth.currentUser.uid, "documents"),
        where("folderId", "==", folderId)
      )
    );

    const deletePromises = [];

    docsSnapshot.forEach((doc) => {
      deletePromises.push(deleteDocument(doc.id, doc.data().name));
    });

    // Eliminar subcarpetas dentro de la carpeta
    const subFoldersSnapshot = await getDocs(
      query(
        collection(db, "users", auth.currentUser.uid, "folders"),
        where("parentId", "==", folderId)
      )
    );

    subFoldersSnapshot.forEach((folderDoc) => {
      deletePromises.push(deleteFolder(folderDoc.id));
    });

    // Esperar a que todas las eliminaciones se completen
    await Promise.all(deletePromises);

    // Eliminar la carpeta actual
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "folders", folderId));

    displayDocuments();
    alert("Carpeta eliminada con éxito.");
  } catch (error) {
    console.error("Error al eliminar la carpeta:", error);
    alert("No se pudo eliminar la carpeta.");
  }
}

// Eliminar documento
async function deleteDocument(docId, fileName) {
  try {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "documents", docId));
    const storageRef = ref(storage, `documents/${auth.currentUser.uid}/${fileName}`);
    await deleteObject(storageRef);
    displayDocuments();
    updateDocumentOverview();
    alert("Documento eliminado con éxito.");
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    alert("No se pudo eliminar el documento.");
  }
}

// Crear nuevo usuario desde el panel de administración
async function createNewUser(event) {
  event.preventDefault();

  const newUserEmail = document.getElementById("new-user-email").value;
  const newUserName = document.getElementById("new-user-name").value;
  const newUserPassword = document.getElementById("new-user-password").value;

  if (!newUserEmail || !newUserName || !newUserPassword) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Llamar a la Cloud Function para crear un nuevo usuario
  const createUserFunction = httpsCallable(functions, "createUser");

  try {
    await createUserFunction({
      email: newUserEmail,
      password: newUserPassword,
      name: newUserName,
    });
    alert("Usuario creado con éxito.");
    updateUserList();
    createUserFormElement.reset();
  } catch (error) {
    console.error("Error al crear usuario:", error);
    alert("No se pudo crear el usuario. " + error.message);
  }
}

// Mostrar la lista de usuarios en el panel de administración
async function updateUserList() {
  const userListContainer = document.getElementById("user-list");
  if (userListContainer) {
    userListContainer.innerHTML = "";

    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = user.profile.fullName || "N/A";
      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;
      const dateCell = document.createElement("td");
      dateCell.textContent = user.registeredAt
        ? new Date(user.registeredAt).toLocaleDateString()
        : "N/A";

      row.appendChild(nameCell);
      row.appendChild(emailCell);
      row.appendChild(dateCell);

      userListContainer.appendChild(row);
    });
  }
}

// Mostrar el panel de administración
async function showAdminPanel() {
  if (auth.currentUser && currentUser.role === "admin") {
    hideAllScreens();
    if (adminPanel) adminPanel.style.display = "block";
    await updateUserList();
  } else {
    alert("No tienes permiso para acceder a esta página.");
  }
}

// Manejar la selección de especialidad y redirigir al chat
async function handleIASpecialtySelection(specialty) {
  if (auth.currentUser) {
    hideAllScreens();
    if (chatScreen) chatScreen.style.display = "block";
    await initializeChatHistory(specialty);
  } else {
    alert("Por favor, inicia sesión para acceder a esta funcionalidad.");
    showLoginScreen();
  }
}

// Función para redirigir a la IA especializada
async function redirectToIA(specialty) {
  currentSpecialty = specialty;
  hideAllScreens();
  if (chatScreen) chatScreen.style.display = "block";
  await initializeChatHistory(specialty);
}

// Función para inicializar el chat
async function initializeChatHistory(specialty) {
  currentSpecialty = specialty;
  chatHistory = []; // Reiniciar el historial

  // Llamar a la función getChatHistory desde Firebase Functions
  const getChatHistoryFunction = httpsCallable(functions, "getChatHistory");
  try {
    const result = await getChatHistoryFunction({ specialty: specialty });
    const messages = result.data.messages;
    if (messages && Array.isArray(messages)) {
      chatHistory = messages;
      messages.forEach((msg) => {
        addMessageToChat(msg.role, msg.content);
      });
    }
  } catch (error) {
    console.error("Error al obtener el historial de chat:", error);
    alert("No se pudo cargar el historial de chat.");
  }
}

// Función para enviar mensaje al chat
async function sendMessage(message, specialty) {
  const chatWithGPT = httpsCallable(functions, "chatWithGPT");
  try {
    const result = await chatWithGPT({ message: message, specialty: specialty });
    return result.data.reply;
  } catch (error) {
    console.error("Error al llamar a la función chatWithGPT:", error);
    return "Lo siento, ha ocurrido un error al procesar tu solicitud.";
  }
}

// Función para manejar el envío del chat
async function handleChatSend(event) {
  event.preventDefault();
  const chatInput = document.getElementById("chat-input");
  const chatSendButton = document.getElementById("chat-send-button");

  if (chatInput && chatInput.value.trim() !== "") {
    const userMessage = chatInput.value.trim();
    chatInput.value = "";

    // Deshabilitar el botón y mostrar indicador de carga
    chatSendButton.disabled = true;
    chatSendButton.textContent = "Enviando...";

    // Mostrar el mensaje del usuario en la interfaz
    addMessageToChat("user", userMessage);

    // Mostrar el indicador de carga
    showLoadingIndicator();

    // Obtener la especialidad seleccionada
    const specialty = currentSpecialty || "biologia"; // Valor por defecto

    // Llamar a la función chatWithGPT
    const reply = await sendMessage(userMessage, specialty);

    // Ocultar el indicador de carga
    hideLoadingIndicator();

    // Mostrar la respuesta de la IA en el chat
    if (reply) {
      addMessageToChat("assistant", reply);
      chatHistory.push({ role: "user", content: userMessage });
      chatHistory.push({ role: "assistant", content: reply });
      await updateChatHistory();
    }

    // Rehabilitar el botón y restablecer el texto
    chatSendButton.disabled = false;
    chatSendButton.textContent = "Enviar";
  }
}

// Función para añadir mensajes al chat en la interfaz
function addMessageToChat(role, content) {
  const chatMessagesContainer = document.getElementById("chat-messages");
  if (chatMessagesContainer) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", role);
    messageElement.textContent = content;
    chatMessagesContainer.appendChild(messageElement);

    // Desplazar el contenedor hacia abajo
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }
}

// Función para mostrar el indicador de carga
function showLoadingIndicator() {
  const chatMessages = document.getElementById("chat-messages");
  if (chatMessages) {
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("chat-message", "assistant");
    loadingElement.textContent = "...";
    loadingElement.id = "loading-indicator";
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Función para ocultar el indicador de carga
function hideLoadingIndicator() {
  const loadingElement = document.getElementById("loading-indicator");
  if (loadingElement) {
    loadingElement.remove();
  }
}

// Función para cargar el historial del chat desde Firestore (si es necesario)
async function loadChatHistory() {
  const chatMessagesContainer = document.getElementById("chat-messages");
  if (chatMessagesContainer && auth.currentUser && currentSpecialty) {
    chatMessagesContainer.innerHTML = "";

    const chatHistoryRef = doc(db, "users", auth.currentUser.uid, "chats", currentSpecialty);
    const chatDoc = await getDoc(chatHistoryRef);

    if (chatDoc.exists()) {
      const messages = chatDoc.data().messages;
      chatHistory = messages; // Actualizar el historial global
      messages.forEach((msg) => {
        addMessageToChat(msg.role, msg.content);
      });
    }
  }
}

// Función para actualizar el historial de chat en Firestore
async function updateChatHistory() {
  if (auth.currentUser && currentSpecialty) {
    const chatHistoryRef = doc(db, "users", auth.currentUser.uid, "chats", currentSpecialty);
    try {
      await setDoc(chatHistoryRef, { messages: chatHistory });
    } catch (error) {
      console.error("Error al actualizar el historial de chat:", error);
    }
  }
}

// Manejar el historial de chat al salir de la página
window.addEventListener("beforeunload", () => {
  if (auth.currentUser && currentSpecialty && chatHistory.length > 0) {
    updateChatHistory();
  }
});

// Función para mostrar el historial de chat al cargar la pantalla de chat
async function displayChatHistory() {
  if (auth.currentUser && currentSpecialty) {
    await loadChatHistory();
  }
}

// Función para mostrar el historial de chat al mostrar la pantalla de chat
async function showChatScreen() {
  if (auth.currentUser && currentSpecialty) {
    hideAllScreens();
    if (chatScreen) chatScreen.style.display = "block";
    await displayChatHistory();
  } else {
    showLoginScreen();
  }
}

// Manejo del historial de chat al seleccionar una especialidad
async function redirectToIA(specialty) {
  if (auth.currentUser) {
    currentSpecialty = specialty;
    hideAllScreens();
    if (chatScreen) chatScreen.style.display = "block";
    await initializeChatHistory(specialty);
  } else {
    alert("Por favor, inicia sesión para acceder a esta funcionalidad.");
    showLoginScreen();
  }
}

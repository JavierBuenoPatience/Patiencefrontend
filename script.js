// script.js

// Importaciones al nivel superior
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
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-functions.js";

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

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  const profileIcon = document.getElementById("profile-icon");
  const dropdown = document.getElementById("profile-dropdown");
  const menu = document.getElementById("menu-desplegable");

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

  // Manejo del estado de autenticación
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;

      // Verificar si el correo electrónico ha sido verificado
      if (!currentUser.emailVerified) {
        alert("Por favor, verifica tu correo electrónico antes de continuar.");
        await sendEmailVerification(currentUser);
        await signOut(auth);
        showLoginScreen();
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        currentUser.profile = userDoc.data().profile || {};
        currentUser.role = userDoc.data().role || "user";
      } else {
        // Si el documento no existe, crear uno nuevo
        await setDoc(doc(db, "users", currentUser.uid), {
          email: currentUser.email,
          profile: {},
          role: "user",
          registeredAt: new Date().toISOString(),
          temporaryPassword: false,
        });
        currentUser.profile = {};
        currentUser.role = "user";
      }
      showHomeScreen();
      if (menu) menu.style.display = "flex";
    } else {
      currentUser = null;
      showLoginScreen();
      if (menu) menu.style.display = "none";
    }
  });

  // Manejo de la subida de documentos
  const uploadDocumentElement = document.getElementById("upload-document");
  if (uploadDocumentElement) {
    uploadDocumentElement.addEventListener("change", uploadDocuments);
  }

  // Event listeners para botones del menú
  const inicioButton = document.getElementById("inicio-button");
  if (inicioButton) inicioButton.addEventListener("click", showHomeScreen);

  const perfilButton = document.getElementById("perfil-button");
  if (perfilButton) perfilButton.addEventListener("click", showProfile);

  const iaButton = document.getElementById("ia-button");
  if (iaButton) iaButton.addEventListener("click", showIASpecializedOptions);

  const gruposButton = document.getElementById("grupos-button");
  if (gruposButton) gruposButton.addEventListener("click", showGroups);

  const documentosButton = document.getElementById("documentos-button");
  if (documentosButton)
    documentosButton.addEventListener("click", showDocuments);

  const trainingButton = document.getElementById("training-button");
  if (trainingButton) trainingButton.addEventListener("click", showTraining);

  const centroButton = document.getElementById("centro-button");
  if (centroButton) centroButton.addEventListener("click", showComingSoon);

  const noticiasButton = document.getElementById("noticias-button");
  if (noticiasButton) noticiasButton.addEventListener("click", showNews);

  const adminButton = document.getElementById("admin-button");
  if (adminButton) adminButton.addEventListener("click", showAdminPanel);

  // Event listeners para otros botones
  const registerButton = document.getElementById("register-button");
  if (registerButton)
    registerButton.addEventListener("click", showRegisterScreen);

  const loginButton = document.getElementById("login-button");
  if (loginButton)
    loginButton.addEventListener("click", showLoginScreen);

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

  const guideButton = document.getElementById("guide-button");
  if (guideButton) guideButton.addEventListener("click", showGuide);

  const directoryButton = document.getElementById("directory-button");
  if (directoryButton)
    directoryButton.addEventListener("click", showDirectory);

  const helpButton = document.getElementById("help-button");
  if (helpButton) helpButton.addEventListener("click", showHelp);

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) logoutButton.addEventListener("click", handleLogout);

  // Event listeners para los botones de noticias
  const csifButton = document.getElementById("csif-button");
  if (csifButton)
    csifButton.addEventListener("click", () => showNewsContent("csif"));

  const sipriButton = document.getElementById("sipri-button");
  if (sipriButton)
    sipriButton.addEventListener("click", () => showNewsContent("sipri"));

  // Event listeners para la sección de ayuda
  const faqsButton = document.getElementById("faqs-button");
  if (faqsButton)
    faqsButton.addEventListener("click", () => toggleSection("faqs-section"));

  const contactButton = document.getElementById("contact-button");
  if (contactButton)
    contactButton.addEventListener("click", () =>
      toggleSection("contact-section")
    );

  // Event listeners para los botones de IA especializada
  const biologiaButton = document.getElementById("biologia-button");
  if (biologiaButton)
    biologiaButton.addEventListener("click", () => redirectToIA("biologia"));

  const inglesButton = document.getElementById("ingles-button");
  if (inglesButton)
    inglesButton.addEventListener("click", () => redirectToIA("ingles"));

  const lenguaButton = document.getElementById("lengua-button");
  if (lenguaButton)
    lenguaButton.addEventListener("click", () => redirectToIA("lengua"));

  const matematicasButton = document.getElementById("matematicas-button");
  if (matematicasButton)
    matematicasButton.addEventListener("click", () =>
      redirectToIA("matematicas")
    );

  // Manejo del formulario de inicio de sesión
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Manejo del formulario de registro
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Manejo del formulario de cambio de contraseña
  const passwordChangeForm = document.getElementById("password-change-form");
  if (passwordChangeForm) {
    passwordChangeForm.addEventListener("submit", handlePasswordChange);
  }

  // Manejo del formulario de perfil
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate);
  }

  // Manejo del formulario de crear usuario (panel de administración)
  const createUserForm = document.getElementById("create-user-form");
  if (createUserForm) {
    createUserForm.addEventListener("submit", createNewUser);
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

  // Event listener para el botón de enviar en el chat
  const chatSendButton = document.getElementById("chat-send-button");
  if (chatSendButton) {
    chatSendButton.addEventListener("click", handleChatSend);
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
    currentUser = userCredential.user;

    // Enviar correo de verificación
    await sendEmailVerification(currentUser);

    // Almacenar información adicional del usuario en Firestore
    await setDoc(doc(db, "users", currentUser.uid), {
      email: currentUser.email,
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
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      currentUser = userCredential.user;

      // Verificar si el correo electrónico ha sido verificado
      if (!currentUser.emailVerified) {
        alert("Por favor, verifica tu correo electrónico antes de continuar.");
        await sendEmailVerification(currentUser);
        await signOut(auth);
        showLoginScreen();
        return;
      }

      showHomeScreen();
      const menu = document.getElementById("menu-desplegable");
      if (menu) menu.style.display = "flex";
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error);
      alert("Correo o contraseña incorrectos. " + error.message);
    });
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
    await updatePassword(currentUser, newPassword);
    await updateDoc(doc(db, "users", currentUser.uid), {
      temporaryPassword: false,
    });
    alert("Contraseña cambiada con éxito.");
    const passwordChangePopup = document.getElementById(
      "password-change-popup"
    );
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
    await updateDoc(doc(db, "users", currentUser.uid), {
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
  const registerScreen = document.getElementById("register-screen");
  if (registerScreen) registerScreen.style.display = "block";
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  if (header) header.style.display = "none";
  if (footer) footer.style.display = "none";
}

// Mostrar la pantalla de inicio de sesión
function showLoginScreen() {
  hideAllScreens();
  const loginScreen = document.getElementById("login-screen");
  if (loginScreen) loginScreen.style.display = "block";
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  if (header) header.style.display = "none";
  if (footer) footer.style.display = "none";
}

// Mostrar la pantalla principal
function showHomeScreen() {
  hideAllScreens();
  const homeScreen = document.getElementById("home-screen");
  if (homeScreen) homeScreen.style.display = "block";
  const userNameHome = document.getElementById("user-name-home");
  if (userNameHome && currentUser)
    userNameHome.textContent =
      currentUser.profile.fullName || currentUser.email;
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  if (header) header.style.display = "flex";
  if (footer) footer.style.display = "block";
  const menu = document.getElementById("menu-desplegable");
  if (menu) menu.style.display = "flex";
  updateProfileIcon();
  updateDocumentOverview();
}

// Funciones para mostrar diferentes pantallas
async function showProfile() {
  if (currentUser) {
    hideAllScreens();
    const profileScreen = document.getElementById("profile-screen");
    if (profileScreen) profileScreen.style.display = "block";

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
      const profile = userDoc.data().profile || {};
      document.getElementById("full-name").value = profile.fullName || "";
      document.getElementById("profile-email").value = currentUser.email || "";
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
  if (currentUser) {
    hideAllScreens();
    const groupsScreen = document.getElementById("groups-screen");
    if (groupsScreen) groupsScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showIASpecializedOptions() {
  if (currentUser) {
    hideAllScreens();
    const iaSpecializedScreen = document.getElementById(
      "ia-specialized-screen"
    );
    if (iaSpecializedScreen) iaSpecializedScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function redirectToIA(specialty) {
  if (currentUser) {
    if (specialty === "biologia") {
      hideAllScreens();
      const chatScreen = document.getElementById("chat-screen");
      if (chatScreen) chatScreen.style.display = "block";
    } else {
      alert("La especialidad seleccionada estará disponible pronto.");
    }
  } else {
    alert("Por favor, inicia sesión para acceder a esta funcionalidad.");
    showLoginScreen();
  }
}

function showTraining() {
  if (currentUser) {
    hideAllScreens();
    const trainingScreen = document.getElementById("training-screen");
    if (trainingScreen) trainingScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showComingSoon() {
  if (currentUser) {
    hideAllScreens();
    const comingSoonScreen = document.getElementById("coming-soon-screen");
    if (comingSoonScreen) comingSoonScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showNews() {
  if (currentUser) {
    hideAllScreens();
    const newsScreen = document.getElementById("news-screen");
    if (newsScreen) newsScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showDocuments() {
  if (currentUser) {
    hideAllScreens();
    const documentsScreen = document.getElementById("documents-screen");
    if (documentsScreen) documentsScreen.style.display = "block";
    displayDocuments();
  } else {
    showLoginScreen();
  }
}

function showGuide() {
  if (currentUser) {
    hideAllScreens();
    const guideScreen = document.getElementById("guide-screen");
    if (guideScreen) guideScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showDirectory() {
  if (currentUser) {
    hideAllScreens();
    const directoryScreen = document.getElementById("directory-screen");
    if (directoryScreen) directoryScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function showHelp() {
  if (currentUser) {
    hideAllScreens();
    const helpScreen = document.getElementById("help-screen");
    if (helpScreen) helpScreen.style.display = "block";
  } else {
    showLoginScreen();
  }
}

function hideAllScreens() {
  const screens = document.querySelectorAll(".card");
  screens.forEach((screen) => (screen.style.display = "none"));
}

function redirectToURL(url) {
  if (currentUser) {
    window.open(url, "_blank");
  } else {
    alert("Por favor, inicia sesión para acceder a esta funcionalidad.");
    showLoginScreen();
  }
}

function handleLogoClick() {
  if (currentUser) {
    showHomeScreen();
  } else {
    showLoginScreen();
  }
}

// Manejar la imagen de perfil
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const storageRef = ref(
      storage,
      `profileImages/${currentUser.uid}/${file.name}`
    );
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      const profileImg = document.getElementById("profile-img");
      if (profileImg) {
        profileImg.src = downloadURL;
      }
      await updateDoc(doc(db, "users", currentUser.uid), {
        "profile.profileImage": downloadURL,
      });
      updateProfileIcon();
    } catch (error) {
      console.error("Error al subir la imagen de perfil:", error);
    }
  }
}

// Actualizar el ícono de perfil en el header
async function updateProfileIcon() {
  const profileIcon = document.getElementById("profile-icon");
  if (profileIcon && currentUser) {
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
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
  if (documentList && currentUser) {
    documentList.innerHTML = "";

    const q = query(
      collection(db, "users", currentUser.uid, "documents"),
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
        .sort((a, b) => b.lastOpened - a.lastOpened)
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
    const storageRef = ref(
      storage,
      `documents/${currentUser.uid}/${file.name}`
    );

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

      await addDoc(
        collection(db, "users", currentUser.uid, "documents"),
        docData
      );
      displayDocuments();
      updateDocumentOverview();
    } catch (error) {
      console.error("Error al subir el documento:", error);
    }
  }
}

// Crear carpeta (puedes expandir esta función para manejar carpetas)
async function createFolder() {
  const folderName = prompt("Nombre de la nueva carpeta:");
  if (folderName) {
    const folderData = {
      name: folderName,
      parentId: null,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(
        collection(db, "users", currentUser.uid, "folders"),
        folderData
      );
      displayDocuments();
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
    }
  }
}

// Mostrar documentos y carpetas
async function displayDocuments() {
  const documentsContainer = document.getElementById("documents-container");
  if (documentsContainer && currentUser) {
    documentsContainer.innerHTML = "";

    // Obtener carpetas raíz
    const foldersSnapshot = await getDocs(
      query(
        collection(db, "users", currentUser.uid, "folders"),
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
        collection(db, "users", currentUser.uid, "documents"),
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
  openButton.onclick = (event) => {
    event.stopPropagation();
    openFolder(folderId, folderData.name);
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
    await updateDoc(doc(db, "users", currentUser.uid, "documents", docId), {
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
  if (documentsContainer && currentUser) {
    documentsContainer.innerHTML = "";

    // Botón para regresar a la raíz
    const backButton = document.createElement("button");
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Volver';
    backButton.onclick = displayDocuments;
    documentsContainer.appendChild(backButton);

    // Obtener subcarpetas
    const subFoldersSnapshot = await getDocs(
      query(
        collection(db, "users", currentUser.uid, "folders"),
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
        collection(db, "users", currentUser.uid, "documents"),
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
  // Eliminar subcarpetas y documentos dentro de la carpeta
  // Implementa esta función según tus necesidades
  alert("Funcionalidad de eliminación de carpetas no implementada.");
}

// Eliminar documento
async function deleteDocument(docId, fileName) {
  try {
    await deleteDoc(doc(db, "users", currentUser.uid, "documents", docId));
    const storageRef = ref(storage, `documents/${currentUser.uid}/${fileName}`);
    await deleteObject(storageRef);
    displayDocuments();
    updateDocumentOverview();
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
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
  } catch (error) {
    console.error("Error al crear usuario:", error);
    alert("No se pudo crear el usuario.");
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
function showAdminPanel() {
  if (currentUser && currentUser.role === "admin") {
    hideAllScreens();
    const adminPanel = document.getElementById("admin-panel");
    if (adminPanel) adminPanel.style.display = "block";
    updateUserList();
  } else {
    alert("No tienes permiso para acceder a esta página.");
  }
}

// Manejar el envío en el chat (puedes implementar interacción con la API de OpenAI)
function handleChatSend() {
  alert("Funcionalidad de chat no implementada en este ejemplo.");
}

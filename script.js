// script.js

const users = JSON.parse(localStorage.getItem('users')) || {};
let documents = JSON.parse(localStorage.getItem('documents')) || {};
let currentFolder = null;

document.addEventListener('DOMContentLoaded', () => {
  showLoadingScreen();

  setTimeout(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (loggedIn) {
      showHomeScreen();
      toggleMenu(true);
    } else {
      showLoginScreen();
      toggleMenu(false);
    }
    hideLoadingScreen();  // Asegura que la pantalla de carga siempre se oculte
  }, 1500);

  setupMenuToggle();
  setupProfileDropdown();
  handleClientLoad();
});

let manualToggle = false;

function toggleMenu(show) {
  const menu = document.getElementById('menu-desplegable');
  menu.style.display = show ? 'block' : 'none';
}

function showLoadingScreen() {
  document.getElementById('loading-screen').style.display = 'flex';
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}

  setupMenuToggle();
  setupProfileDropdown();
  handleClientLoad();
});

let manualToggle = false;

function toggleMenu(show) {
  const menu = document.getElementById('menu-desplegable');
  menu.style.display = show ? 'block' : 'none';
}

function showLoadingScreen() {
  document.getElementById('loading-screen').style.display = 'flex';
}

function hideLoadingScreen() {
  document.getElementById('loading-screen').style.display = 'none';
}

function handleRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  if (!validateEmail(email)) {
    return alert('Por favor, utiliza un correo de Gmail o Hotmail.');
  }

  if (users[email]) {
    return alert('Correo ya registrado. Por favor, inicia sesión.');
  }

  users[email] = { name, email, password, profile: {} };
  localStorage.setItem('users', JSON.stringify(users));

  document.getElementById('registration-form').reset();
  document.getElementById('registration-message').style.display = 'block';
  document.getElementById('welcome-button').style.display = 'block';
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!validateEmail(email)) {
    return alert('Por favor, utiliza un correo de Gmail o Hotmail.');
  }

  if (users[email] && users[email].password === password) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('email', email);
    localStorage.setItem('name', users[email].name);
    showHomeScreen();
    toggleMenu(true);
  } else {
    alert('Correo o contraseña incorrectos.');
  }
}

function handleLogout() {
  localStorage.clear();
  toggleMenu(false);
  hideAllScreens();
  showLoginScreen();
}

function handleProfileUpdate(event) {
  event.preventDefault();
  const email = localStorage.getItem('email');
  const profile = {
    fullName: document.getElementById('full-name').value,
    phone: document.getElementById('phone').value,
    studyTime: document.getElementById('study-time').value,
    specialty: document.getElementById('specialty').value,
    profileImage: document.getElementById('profile-img').src
  };
  users[email].profile = profile;
  localStorage.setItem('users', JSON.stringify(users));
  alert('Perfil actualizado con éxito');
  updateProfileIcon();
}

function validateEmail(email) {
  const validEmails = ['@gmail.com', '@hotmail.com'];
  return validEmails.some(domain => email.endsWith(domain));
}

function showLoginScreen() {
  hideAllScreens();
  document.getElementById('login-screen').style.display = 'block';
  toggleHeaderFooter(false);
}

function showRegistrationScreen() {
  hideAllScreens();
  document.getElementById('registration-screen').style.display = 'block';
  toggleHeaderFooter(false);
}

function showHomeScreen() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('user-name-home').textContent = localStorage.getItem('name');
    toggleHeaderFooter(true);
    updateProfileIcon();
  } else {
    showLoginScreen();
  }
}

function toggleHeaderFooter(show) {
  document.querySelector('header').style.display = show ? 'flex' : 'none';
  document.querySelector('footer').style.display = show ? 'block' : 'none';
}

function showProfile() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('profile-screen').style.display = 'flex';
    const email = localStorage.getItem('email');
    const profile = users[email].profile || {};
    document.getElementById('full-name').value = profile.fullName || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('study-time').value = profile.studyTime || '';
    document.getElementById('specialty').value = profile.specialty || '';
    document.getElementById('profile-img').src = profile.profileImage || 'assets/default-profile.png';
  } else {
    showLoginScreen();
  }
}

function showGroups() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('groups-screen').style.display = 'block';
  } else {
    showLoginScreen();
  }
}

function showTraining() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('training-screen').style.display = 'block';
  } else {
    showLoginScreen();
  }
}

function showNews() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('news-screen').style.display = 'block';
  } else {
    showLoginScreen();
  }
}

function showDocuments() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('documents-screen').style.display = 'block';
    displayDocuments();
  } else {
    showLoginScreen();
  }
}

function showComingSoon() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('coming-soon-screen').style.display = 'block';
  } else {
    showLoginScreen();
  }
}

function hideAllScreens() {
  const screens = document.querySelectorAll('.card');
  screens.forEach(screen => screen.style.display = 'none');
}

function redirectToURL(url) {
  if (localStorage.getItem('loggedIn') === 'true') {
    window.open(url, '_blank');
  } else {
    alert('Por favor, inicia sesión para acceder a esta funcionalidad.');
    showLoginScreen();
  }
}

function handleLogoClick() {
  if (localStorage.getItem('loggedIn') === 'true') {
    showHomeScreen();
  } else {
    showLoginScreen();
  }
}

function handleProfilePicUpload(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('profile-img').src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function updateProfileIcon() {
  const email = localStorage.getItem('email');
  const profile = users[email].profile || {};
  document.getElementById('profile-icon').src = profile.profileImage || 'assets/default-profile.png';
}

function setupMenuToggle() {
  const menu = document.getElementById('menu-desplegable');
  const mainContent = document.querySelector('.main-content');
  const headerLeft = document.querySelector('.header-left');

  menu.addEventListener('mouseenter', () => {
    if (!manualToggle && localStorage.getItem('loggedIn') === 'true') {
      menu.classList.add('show');
    }
  });

  menu.addEventListener('mouseleave', () => {
    if (!manualToggle && localStorage.getItem('loggedIn') === 'true') {
      menu.classList.remove('show');
    }
  });

  mainContent.addEventListener('mouseenter', () => {
    if (!manualToggle && localStorage.getItem('loggedIn') === 'true') {
      menu.classList.remove('show');
    }
  });

  headerLeft.addEventListener('mouseenter', () => {
    if (!manualToggle && localStorage.getItem('loggedIn') === 'true') {
      menu.classList.add('show');
    }
  });
}

function setupProfileDropdown() {
  const headerRight = document.querySelector('.header-right img');
  headerRight.addEventListener('click', () => {
    toggleProfileDropdown();
  });
}

// Integración con Google Calendar

let CLIENT_ID = '1051045274828-t36vldu3s900upednlah9v59qdgo6onj.apps.googleusercontent.com';
let API_KEY = 'AIzaSyDekTyQEzRbB2uI0-jVp6d-Fpwwnz5EeWk';
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, (error) => {
    console.error('Error initializing Google API client:', error);
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('authorize-button').style.display = 'none';
    document.getElementById('calendar').style.display = 'block';
    loadCalendar();
  } else {
    document.getElementById('authorize-button').style.display = 'block';
    document.getElementById('calendar').style.display = 'none';
  }
}

function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
  gapi.auth2.getAuthInstance().signOut();
}

function loadCalendar() {
  gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: 'startTime'
  }).then((response) => {
    const events = response.result.items;
    if (events.length > 0) {
      const calendarIframe = document.getElementById('calendar-iframe');
      const calendarSrc = `https://calendar.google.com/calendar/embed?src=${gapi.auth2.getAuthInstance().currentUser.get().getId()}&ctz=Europe/Madrid`;
      calendarIframe.src = calendarSrc;
    } else {
      console.log('No upcoming events found.');
    }
  });
}

// Funciones para manejo de documentos

function handleFileUpload(event) {
  const file = event.target.files[0];
  const email = localStorage.getItem('email');
  if (!documents[email]) {
    documents[email] = [];
  }

  const fileData = { name: file.name, type: 'file', content: URL.createObjectURL(file) };

  if (currentFolder !== null) {
    documents[email][currentFolder].content.push(fileData);
  } else {
    documents[email].push(fileData);
  }

  localStorage.setItem('documents', JSON.stringify(documents));
  displayDocuments();
}

function createFolder() {
  const folderName = prompt('Nombre de la carpeta:');
  if (folderName) {
    const email = localStorage.getItem('email');
    if (!documents[email]) {
      documents[email] = [];
    }

    const folderData = { name: folderName, type: 'folder', content: [] };

    if (currentFolder !== null) {
      documents[email][currentFolder].content.push(folderData);
    } else {
      documents[email].push(folderData);
    }

    localStorage.setItem('documents', JSON.stringify(documents));
    displayDocuments();
  }
}

function displayDocuments() {
  const email = localStorage.getItem('email');
  const documentsList = document.getElementById('documents-list');
  const backButton = document.querySelector('.back-button');

  documentsList.innerHTML = '';

  if (currentFolder === null) {
    backButton.style.display = 'none';
    if (documents[email]) {
      documents[email].forEach((doc, index) => {
        documentsList.appendChild(createDocumentElement(doc, index));
      });
    }
  } else {
    backButton.style.display = 'block';
    const folder = documents[email][currentFolder];
    folder.content.forEach((doc, index) => {
      documentsList.appendChild(createDocumentElement(doc, index, currentFolder));
    });
  }
}

function createDocumentElement(doc, index, folderIndex = null) {
  const div = document.createElement('div');
  div.className = doc.type === 'folder' ? 'document-folder' : 'document-file';
  div.innerHTML = `
    <span><i class="${doc.type === 'folder' ? 'fas fa-folder' : 'fas fa-file-alt'}"></i>${doc.name}</span>
    <div>
      <button onclick="${folderIndex === null ? `deleteDocument(${index})` : `deleteFolderDocument(${folderIndex}, ${index})`}"><i class="fas fa-trash-alt"></i></button>
      ${doc.type === 'file' ? `<a href="${doc.content}" target="_blank"><i class="fas fa-external-link-alt"></i></a>` : `<button onclick="openFolder(${index})"><i class="fas fa-folder-open"></i></button>`}
    </div>
  `;
  return div;
}

function deleteDocument(index) {
  const email = localStorage.getItem('email');
  documents[email].splice(index, 1);
  localStorage.setItem('documents', JSON.stringify(documents));
  displayDocuments();
}

function openFolder(index) {
  currentFolder = index;
  displayDocuments();
}

function deleteFolderDocument(folderIndex, docIndex) {
  const email = localStorage.getItem('email');
  documents[email][folderIndex].content.splice(docIndex, 1);
  localStorage.setItem('documents', JSON.stringify(documents));
  displayDocuments();
}

function goBack() {
  currentFolder = null;
  displayDocuments();
}

// Manejo de Preguntas Frecuentes (FAQ)

document.addEventListener('DOMContentLoaded', () => {
  const faqButton = document.getElementById('faq-button');
  const faqSection = document.getElementById('faq-section');

  faqButton.addEventListener('click', toggleFaqSection);

  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
  });
});

function toggleFaqSection() {
  const faqSection = document.getElementById('faq-section');
  faqSection.style.display = faqSection.style.display === 'block' ? 'none' : 'block';
}

// Planificador de Estudio

const studySessions = JSON.parse(localStorage.getItem('studySessions')) || [];

function showStudyPlannerScreen() {
  hideAllScreens();
  document.getElementById('study-planner-screen').style.display = 'block';
  displayStudySessions();
}

function addStudySession(event) {
  event.preventDefault();
  const title = document.getElementById('session-title').value;
  const date = document.getElementById('session-date').value;
  const time = document.getElementById('session-time').value;

  const session = { title, date, time };
  studySessions.push(session);
  localStorage.setItem('studySessions', JSON.stringify(studySessions));

  displayStudySessions();
  document.getElementById('study-planner-form').reset();
}

function displayStudySessions() {
  const list = document.getElementById('study-sessions-list');
  list.innerHTML = '';

  studySessions.forEach((session) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${session.title} - ${session.date} a las ${session.time}`;
    list.appendChild(listItem);
  });
}

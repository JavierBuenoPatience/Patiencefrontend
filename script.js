// script.js

const users = JSON.parse(localStorage.getItem('users')) || {};

document.addEventListener('DOMContentLoaded', () => {
  showLoadingScreen();
  setTimeout(() => {
    hideLoadingScreen();
    if (localStorage.getItem('loggedIn') === 'true') {
      showHomeScreen();
    } else {
      showLoginScreen();
    }
  }, 2000);
});

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
    alert('Por favor, utiliza un correo de Gmail o Hotmail.');
    return;
  }

  if (users[email]) {
    alert('Correo ya registrado. Por favor, inicia sesión.');
    return;
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
    alert('Por favor, utiliza un correo de Gmail o Hotmail.');
    return;
  }

  if (users[email] && users[email].password === password) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('email', email);
    localStorage.setItem('name', users[email].name);
    showHomeScreen();
  } else {
    alert('Correo o contraseña incorrectos.');
  }
}

function handleLogout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
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
    specialty: document.getElementById('specialty').value
  };
  users[email].profile = profile;
  localStorage.setItem('users', JSON.stringify(users));
  alert('Perfil actualizado con éxito');
}

function validateEmail(email) {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const hotmailRegex = /^[a-zA-Z0-9._%+-]+@hotmail\.com$/;
  return gmailRegex.test(email) || hotmailRegex.test(email);
}

function showLoginScreen() {
  hideAllScreens();
  document.getElementById('login-screen').style.display = 'block';
}

function showRegistrationScreen() {
  hideAllScreens();
  document.getElementById('registration-screen').style.display = 'block';
}

function showHomeScreen() {
  hideAllScreens();
  document.getElementById('home-screen').style.display = 'block';
  document.getElementById('user-name-home').textContent = localStorage.getItem('name');
}

function showProfile() {
  hideAllScreens();
  document.getElementById('profile-screen').style.display = 'block';
  const email = localStorage.getItem('email');
  const profile = users[email].profile || {};
  document.getElementById('full-name').value = profile.fullName || '';
  document.getElementById('phone').value = profile.phone || '';
  document.getElementById('study-time').value = profile.studyTime || '';
  document.getElementById('specialty').value = profile.specialty || '';
}

function showGroups() {
  hideAllScreens();
  document.getElementById('groups-screen').style.display = 'block';
}

function showTraining() {
  hideAllScreens();
  document.getElementById('training-screen').style.display = 'block';
}

function showComingSoon() {
  hideAllScreens();
  document.getElementById('coming-soon-screen').style.display = 'block';
}

function hideAllScreens() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('registration-screen').style.display = 'none';
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('profile-screen').style.display = 'none';
  document.getElementById('groups-screen').style.display = 'none';
  document.getElementById('training-screen').style.display = 'none';
  document.getElementById('coming-soon-screen').style.display = 'none';
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

function toggleMenu() {
  const menu = document.getElementById('menu-desplegable');
  menu.classList.toggle('show');
}

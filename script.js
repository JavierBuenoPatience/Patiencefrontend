// script.js

const users = JSON.parse(localStorage.getItem('users')) || {};

document.addEventListener('DOMContentLoaded', () => {
  showLoadingScreen();
  setTimeout(() => {
    hideLoadingScreen();
    if (localStorage.getItem('loggedIn') === 'true') {
      showHomeScreen();
      document.getElementById('menu-desplegable').style.display = 'block';
    } else {
      showLoginScreen();
      document.getElementById('menu-desplegable').style.display = 'none';
    }
  }, 2000);

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

  const headerRight = document.querySelector('.header-right img');
  headerRight.addEventListener('click', () => {
    toggleProfileDropdown();
  });

  const headerLeftLogo = document.querySelector('.header-left');
  headerLeftLogo.addEventListener('click', () => {
    if (localStorage.getItem('loggedIn') !== 'true') {
      showLoginScreen();
    }
  });

  // Cargar cliente de Google API
  handleClientLoad();
});

let manualToggle = false;

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
    document.getElementById('menu-desplegable').style.display = 'block';
  } else {
    alert('Correo o contraseña incorrectos.');
  }
}

function handleLogout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  const menu = document.getElementById('menu-desplegable');
  menu.classList.remove('show');
  menu.style.display = 'none';
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
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const hotmailRegex = /^[a-zA-Z0-9._%+-]+@hotmail\.com$/;
  return gmailRegex.test(email) || hotmailRegex.test(email);
}

function showLoginScreen() {
  hideAllScreens();
  document.getElementById('login-screen').style.display = 'block';
  document.querySelector('header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
}

function showRegistrationScreen() {
  hideAllScreens();
  document.getElementById('registration-screen').style.display = 'block';
  document.querySelector('header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
}

function showHomeScreen() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('user-name-home').textContent = localStorage.getItem('name');
    document.querySelector('header').style.display = 'flex';
    document.querySelector('footer').style.display = 'block';
    updateProfileIcon();
  } else {
    showLoginScreen();
  }
}

function showProfile() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('profile-screen').style.display = 'block';
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

function showComingSoon() {
  if (localStorage.getItem('loggedIn') === 'true') {
    hideAllScreens();
    document.getElementById('coming-soon-screen').style.display = 'block';
  } else {
    showLoginScreen();
  }
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

function handleImageUpload(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('profile-img').src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function updateProfileIcon() {
  const email = localStorage.getItem('email');
  const profile = users[email].profile || {};
  const profileIcon = document.getElementById('profile-icon');
  if (profileIcon)

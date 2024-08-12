// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mostrar la pantalla de inicio por defecto
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (loggedIn) {
        showHomeScreen();
        toggleMenu(true);
    } else {
        showLoginScreen();
        toggleMenu(false);
    }

    setupMenuToggle();
});

function showHomeScreen() {
    hideAllScreens();
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('user-name-home').textContent = localStorage.getItem('name') || 'Usuario';
}

function showProfileScreen() {
    hideAllScreens();
    document.getElementById('profile-screen').style.display = 'flex';
    const email = localStorage.getItem('email');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const profile = users[email]?.profile || {};
    document.getElementById('full-name').value = profile.fullName || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('study-time').value = profile.studyTime || '';
    document.getElementById('specialty').value = profile.specialty || '';
    document.getElementById('profile-img').src = profile.profileImage || 'assets/default-profile.png';
}

function showLoginScreen() {
    hideAllScreens();
    document.getElementById('login-screen').style.display = 'block';
}

function showRegistrationScreen() {
    hideAllScreens();
    document.getElementById('registration-screen').style.display = 'block';
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.card');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
}

function toggleMenu(show) {
    const menu = document.getElementById('menu-desplegable');
    menu.style.display = show ? 'block' : 'none';
}

function setupMenuToggle() {
    const menu = document.getElementById('menu-desplegable');

    menu.addEventListener('mouseenter', () => {
        if (localStorage.getItem('loggedIn') === 'true') {
            menu.classList.add('show');
        }
    });

    menu.addEventListener('mouseleave', () => {
        if (localStorage.getItem('loggedIn') === 'true') {
            menu.classList.remove('show');
        }
    });

    document.querySelector('.main-content').addEventListener('mouseenter', () => {
        if (localStorage.getItem('loggedIn') === 'true') {
            menu.classList.remove('show');
        }
    });
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || {};

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

function handleRegistration(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email]) {
        alert('Correo ya registrado. Por favor, inicia sesión.');
    } else {
        users[email] = { name, email, password, profile: {} };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        showLoginScreen();
    }
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const email = localStorage.getItem('email');
    const users = JSON.parse(localStorage.getItem('users')) || {};
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
}

function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('profile-img').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function handleLogout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    toggleMenu(false);
    showLoginScreen();
}

const users = JSON.parse(localStorage.getItem('users')) || {};

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu-desplegable');
    const mainContent = document.querySelector('.main-content');
    const headerLeft = document.querySelector('.header-left');
    const headerRight = document.querySelector('.header-right img');

    // Verifica el estado de inicio de sesión
    if (localStorage.getItem('loggedIn') === 'true') {
        showHomeScreen();
        menu.style.display = 'block'; // Asegura que el menú sea visible
    } else {
        showLoginScreen();
        menu.style.display = 'none';
    }

    // Alterna el menú de perfil
    headerRight.addEventListener('click', () => {
        toggleProfileDropdown();
    });

    // Maneja clics en el logo
    headerLeft.addEventListener('click', () => {
        if (localStorage.getItem('loggedIn') !== 'true') {
            showLoginScreen();
        }
    });
});

let manualToggle = false;

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

function showNews() {
    if (localStorage.getItem('loggedIn') === 'true') {
        hideAllScreens();
        document.getElementById('news-screen').style.display = 'block';
    } else {
        showLoginScreen();
    }
}

function showHelp() {
    if (localStorage.getItem('loggedIn') === 'true') {
        hideAllScreens();
        document.getElementById('help-screen').style.display = 'block';
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
    document.getElementById('news-screen').style.display = 'none';
    document.getElementById('coming-soon-screen').style.display = 'none';
    document.getElementById('help-screen').style.display = 'none';
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
    reader.onload = function (e) {
        document.getElementById('profile-img').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function updateProfileIcon() {
    const email = localStorage.getItem('email');
    const profile = users[email].profile || {};
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        profileIcon.src = profile.profileImage || 'assets/default-profile.png';
    }
}

function showNewsContent(newsType) {
    const csifIframe = document.getElementById('csif-iframe');
    const sipriIframe = document.getElementById('sipri-iframe');

    // Oculta ambos iframes
    csifIframe.style.display = 'none';
    sipriIframe.style.display = 'none';

    // Muestra el iframe seleccionado
    if (newsType === 'csif') {
        csifIframe.style.display = 'block';
    } else if (newsType === 'sipri') {
        sipriIframe.style.display = 'block';
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

function showContactOptions() {
    const contactOptions = document.getElementById('contact-options');
    contactOptions.classList.toggle('show');
}


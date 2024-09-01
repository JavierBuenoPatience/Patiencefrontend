const users = JSON.parse(localStorage.getItem('users')) || {};

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu-desplegable');
    const mainContent = document.querySelector('.main-content');
    const headerLeft = document.querySelector('.header-left');
    const headerRight = document.querySelector('.header-right img');
    const dropdown = document.getElementById('profile-dropdown');

    if (localStorage.getItem('loggedIn') === 'true') {
        showHomeScreen();
        menu.style.display = 'block';
        updateDocumentOverview();
    } else {
        showLoginScreen();
        menu.style.display = 'none';
    }

    headerRight.addEventListener('click', () => {
        dropdown.classList.toggle('show-dropdown');
    });

    document.addEventListener('click', (event) => {
        if (!headerRight.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show-dropdown');
        }
    });
});

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

    users[email] = { name, email, password, profile: {}, documents: [], folders: [] };
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
        hobbies: document.getElementById('hobbies').value,
        location: document.getElementById('location').value,
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
        updateDocumentOverview();
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
        document.getElementById('hobbies').value = profile.hobbies || '';
        document.getElementById('location').value = profile.location || '';
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

function showIASpecializedOptions() {
    if (localStorage.getItem('loggedIn') === 'true') {
        hideAllScreens();
        document.getElementById('ia-specialized-screen').style.display = 'block';
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

function showDocuments() {
    if (localStorage.getItem('loggedIn') === 'true') {
        hideAllScreens();
        document.getElementById('documents-screen').style.display = 'block';
        displayDocuments();
    } else {
        showLoginScreen();
    }
}

function showGuide() {
    hideAllScreens();
    document.getElementById('guide-screen').style.display = 'block';
}

function showDirectory() {
    hideAllScreens();
    document.getElementById('directory-screen').style.display = 'block';
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

function updateDocumentOverview() {
    // Función para actualizar la vista de documentos en la pantalla de inicio.
}

function createFolder() {
    // Función para crear carpetas en la sección de documentos.
}

function displayDocuments() {
    // Función para mostrar documentos en la pantalla de documentos.
}

function showNewsContent(newsType) {
    // Función para mostrar el contenido de las noticias según el tipo (CSIF o SIPRI).
}

function toggleSection(sectionId) {
    // Función para alternar la visibilidad de las secciones de ayuda.
}

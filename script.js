const users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;
const adminEmail = 'javibueda@gmail.com'; // Correo del administrador

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu-desplegable');
    const headerRight = document.querySelector('.header-right img');
    const dropdown = document.getElementById('profile-dropdown');

    // Verificar si el usuario ha iniciado sesión
    if (localStorage.getItem('loggedIn') === 'true') {
        currentUser = users[localStorage.getItem('email')];
        showHomeScreen();
        menu.style.display = 'block';
        checkIfPasswordNeedsChange(); // Verificar si necesita cambiar contraseña temporal
    } else {
        showLoginScreen();
        menu.style.display = 'none';
    }

    // Mostrar u ocultar el menú desplegable del perfil
    headerRight.addEventListener('click', () => {
        dropdown.classList.toggle('show-dropdown');
    });

    document.addEventListener('click', (event) => {
        if (!headerRight.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show-dropdown');
        }
    });

    // Manejo de la subida de documentos (verifica que upload-document exista en el DOM)
    const uploadDocumentInput = document.getElementById('upload-document');
    if (uploadDocumentInput) {
        uploadDocumentInput.addEventListener('change', uploadDocuments);
    }

    // Mostrar botón de administración si el usuario es el administrador
    const adminButton = document.getElementById('admin-panel-button');
    if (adminButton) {
        adminButton.addEventListener('click', showAdminPanel);
    }

    updateUserList(); // Actualizar la lista de usuarios al cargar la pantalla de administración
});

// Función para manejar el login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (users[email] && users[email].password === password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('email', email);
        currentUser = users[email];
        showHomeScreen();
        document.getElementById('menu-desplegable').style.display = 'block';
        checkIfPasswordNeedsChange(); // Verificar si necesita cambiar contraseña temporal
    } else {
        alert('Correo o contraseña incorrectos.');
    }
}

// Función para verificar si se necesita cambiar la contraseña
function checkIfPasswordNeedsChange() {
    if (currentUser && currentUser.temporaryPassword) {
        document.getElementById('password-change-popup').style.display = 'block';
    }
}

// Función para cambiar la contraseña temporal
function handleFirstPasswordChange(event) {
    event.preventDefault();
    const newPassword = document.getElementById('new-password').value;

    if (currentUser) {
        currentUser.password = newPassword;
        delete currentUser.temporaryPassword;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Contraseña cambiada con éxito.');
        document.getElementById('password-change-popup').style.display = 'none';
    }
}

// Función para cerrar sesión
function handleLogout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('email');
    currentUser = null;
    hideAllScreens();
    showLoginScreen();
}

// Función para mostrar la pantalla de planificación
function showPlanning() {
    hideAllScreens(); // Oculta todas las demás pantallas
    document.getElementById('plan-screen').style.display = 'block'; // Muestra la pantalla de Planning
}

// Función para ocultar todas las pantallas (función de apoyo)
function hideAllScreens() {
    const screens = document.querySelectorAll('.card'); // Selecciona todas las pantallas con la clase 'card'
    screens.forEach(screen => {
        screen.style.display = 'none'; // Oculta todas las pantallas
    });
}

// Función para mostrar la pantalla de inicio
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

// Función para mostrar la pantalla de perfil
function showProfile() {
    hideAllScreens();
    document.getElementById('profile-screen').style.display = 'block';
}

// Función para manejar el cálculo del plan de estudio
function handlePlanCalculation(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const examDate = new Date(document.getElementById('exam-date').value);
    const dailyHours = parseInt(document.getElementById('daily-hours').value);
    const totalTopics = parseInt(document.getElementById('total-topics').value);

    // Calcular los días restantes hasta el examen
    const today = new Date();
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    // Calcular los temas por día
    const topicsPerDay = Math.ceil(totalTopics / daysLeft);

    // Mostrar los resultados
    document.getElementById('topics-per-day').textContent = `Debes estudiar ${topicsPerDay} temas por día.`;
    document.getElementById('days-left').textContent = `Quedan ${daysLeft} días hasta el examen.`;
    document.getElementById('plan-result').style.display = 'block';

    // Guardar datos en localStorage
    localStorage.setItem('topicsPerDay', topicsPerDay);
    localStorage.setItem('totalTopics', totalTopics);
    localStorage.setItem('daysLeft', daysLeft);
    localStorage.setItem('completedTopics', 0);
}

// Función para marcar los temas como completados y ajustar el plan
function markAsCompleted() {
    const examDate = new Date(document.getElementById('exam-date').value);
    const today = new Date();
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    let completedTopics = parseInt(localStorage.getItem('completedTopics'));
    let totalTopics = parseInt(localStorage.getItem('totalTopics'));

    // Actualizar los temas completados
    completedTopics += parseInt(localStorage.getItem('topicsPerDay'));
    localStorage.setItem('completedTopics', completedTopics);

    // Calcular los temas restantes
    const remainingTopics = totalTopics - completedTopics;

    // Ajustar el plan si quedan días
    if (remainingTopics > 0 && daysLeft > 0) {
        const newTopicsPerDay = Math.ceil(remainingTopics / daysLeft);
        localStorage.setItem('topicsPerDay', newTopicsPerDay);
        document.getElementById('topics-per-day').textContent = `Debes estudiar ${newTopicsPerDay} temas por día. Te faltan ${remainingTopics} temas.`;
    } else {
        document.getElementById('topics-per-day').textContent = '¡Has completado todos los temas! ¡Buen trabajo!';
    }
}

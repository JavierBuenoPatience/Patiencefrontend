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
        showAdminButtonIfAdmin(); // Mostrar botón del panel de administración si es el admin
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

    // Manejo de la subida de documentos
    const uploadDocumentBtn = document.getElementById('upload-document');
    if (uploadDocumentBtn) {
        uploadDocumentBtn.addEventListener('change', uploadDocuments);
    }

    updateUserList(); // Actualizar la lista de usuarios al cargar la pantalla de administración
});

function redirectToTypeform() {
    window.location.href = "https://qz232a8zljw.typeform.com/to/AHskzuV5?typeform-source=javierbuenopatience.github.io";
}

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
        showAdminButtonIfAdmin(); // Mostrar botón del panel de administración si es el admin
    } else {
        alert('Correo o contraseña incorrectos.');
    }
}

function checkIfPasswordNeedsChange() {
    if (currentUser && currentUser.temporaryPassword) {
        document.getElementById('password-change-popup').style.display = 'block';
    }
}

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

function handleLogout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('email');
    currentUser = null;
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

function showHomeScreen() {
    if (localStorage.getItem('loggedIn') === 'true') {
        hideAllScreens();
        document.getElementById('home-screen').style.display = 'block';
        document.getElementById('user-name-home').textContent = localStorage.getItem('name');
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
        updateProfileIcon();
        updateDocumentOverview();
        updateHomeProgress(); // Actualizar la barra de progreso de planificación en el home
    } else {
        showLoginScreen();
    }
}

function showAdminButtonIfAdmin() {
    if (localStorage.getItem('email') === adminEmail) {
        document.querySelector('li a[onclick="showAdminPanel()"]').style.display = 'block';
    } else {
        document.querySelector('li a[onclick="showAdminPanel()"]').style.display = 'none';
    }
}

function showAdminPanel() {
    if (localStorage.getItem('email') === adminEmail) {
        hideAllScreens();
        document.getElementById('admin-panel').style.display = 'block';
        updateUserList();
    } else {
        alert('No tienes permiso para acceder a esta página.');
    }
}

// Función de actualización del progreso del plan en la pantalla de inicio
function updateHomeProgress() {
    const studyPlan = JSON.parse(localStorage.getItem('studyPlan'));
    if (!studyPlan) return;

    const progressPercentage = Math.min((studyPlan.completedTopics / studyPlan.totalTopics) * 100, 100);
    document.getElementById('home-progress-bar').style.width = `${progressPercentage}%`;
    document.getElementById('home-progress-text').textContent = `${Math.floor(progressPercentage)}%`;

    document.getElementById('planning-overview').style.display = 'block'; // Mostrar la barra en el home
}

// Función para ocultar todas las pantallas
function hideAllScreens() {
    const screens = document.querySelectorAll('.card');
    screens.forEach(screen => screen.style.display = 'none');
}

// Funciones del planificador de estudios
function setupStudyPlan(event) {
    event.preventDefault();

    const examDate = new Date(document.getElementById('exam-date').value);
    const dailyHours = parseInt(document.getElementById('daily-hours').value);
    const totalTopics = parseInt(document.getElementById('total-topics').value);

    const today = new Date();
    const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    const topicsPerDay = Math.ceil(totalTopics / daysUntilExam);

    const studyPlan = {
        examDate: examDate,
        dailyHours: dailyHours,
        totalTopics: totalTopics,
        topicsPerDay: topicsPerDay,
        daysUntilExam: daysUntilExam,
        completedTopics: 0,
        currentDay: 1
    };

    localStorage.setItem('studyPlan', JSON.stringify(studyPlan));

    showStudyPlan();
    updateHomeProgress();
}

function showStudyPlan() {
    const studyPlan = JSON.parse(localStorage.getItem('studyPlan'));
    if (!studyPlan) return;

    const topicsPerDay = studyPlan.topicsPerDay;
    const daysLeft = studyPlan.daysUntilExam - studyPlan.currentDay;
    const completedTopics = studyPlan.completedTopics;

    document.getElementById('topics-per-day').textContent = topicsPerDay;
    document.getElementById('exam-date-display').textContent = new Date(studyPlan.examDate).toLocaleDateString();
    document.getElementById('days-left').textContent = daysLeft;

    const progressPercentage = Math.min((completedTopics / studyPlan.totalTopics) * 100, 100);
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;

    document.getElementById('study-plan').style.display = 'block';
    document.getElementById('study-planner-form').style.display = 'none';
}

function markTopicsAsCompleted() {
    const studyPlan = JSON.parse(localStorage.getItem('studyPlan'));
    if (!studyPlan) return;

    studyPlan.completedTopics += studyPlan.topicsPerDay;
    studyPlan.currentDay++;

    if (studyPlan.completedTopics >= studyPlan.totalTopics) {
        alert('¡Felicidades! Has completado todos los temas.');
        localStorage.removeItem('studyPlan');
        document.getElementById('study-plan').style.display = 'none';
        document.getElementById('study-planner-form').style.display = 'block';
    } else {
        localStorage.setItem('studyPlan', JSON.stringify(studyPlan));
        showStudyPlan();
        updateHomeProgress();
    }
}

function showPlanning() {
    hideAllScreens();
    document.getElementById('planning-screen').style.display = 'block';

    const studyPlan = JSON.parse(localStorage.getItem('studyPlan'));
    if (studyPlan) {
        showStudyPlan();
    }
}

// Funciones adicionales de usuarios y documentos
function createNewUser(event) {
    event.preventDefault();
    const newUserEmail = document.getElementById('new-user-email').value;
    const newUserName = document.getElementById('new-user-name').value;
    const newUserPassword = document.getElementById('new-user-password').value;

    if (!newUserEmail || !newUserName || !newUserPassword) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (users[newUserEmail]) {
        alert('El correo ya está registrado.');
        return;
    }

    users[newUserEmail] = {
        name: newUserName,
        password: newUserPassword,
        profile: {},
        documents: [],
        folders: [],
        temporaryPassword: true
    };

    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('create-user-form').reset();
    alert('Usuario creado con éxito.');
    updateUserList();
}

function deleteUser(email) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
        delete users[email];
        localStorage.setItem('users', JSON.stringify(users));
        updateUserList();
        alert('Usuario eliminado con éxito.');
    }
}

function updateUserList() {
    const userListContainer = document.getElementById('user-list');
    userListContainer.innerHTML = '';

    Object.keys(users).forEach(email => {
        const user = users[email];
        const userItem = document.createElement('tr');
        userItem.innerHTML = `
            <td>${user.name || 'N/A'}</td>
            <td>${email}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><button onclick="deleteUser('${email}')">Eliminar</button></td>
        `;
        userListContainer.appendChild(userItem);
    });
}

// Funciones relacionadas con documentos y carpetas
function uploadDocuments(event) {
    const email = localStorage.getItem('email');
    const files = event.target.files;

    if (!users[email].documents) {
        users[email].documents = [];
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const documentData = {
                name: file.name,
                lastOpened: null,
                folder: null,
                fileContent: e.target.result
            };
            users[email].documents.push(documentData);
            localStorage.setItem('users', JSON.stringify(users));
            displayDocuments();
            updateDocumentOverview();
        };

        reader.readAsDataURL(file);
    }
}

function createFolder() {
    const folderName = prompt('Nombre de la nueva carpeta:');
    if (folderName) {
        const folderData = { name: folderName, documents: [] };
        const email = localStorage.getItem('email');
        users[email].folders.push(folderData);
        localStorage.setItem('users', JSON.stringify(users));
        displayDocuments();
    }
}

function deleteFolder(folderName) {
    const email = localStorage.getItem('email');
    const folderIndex = users[email].folders.findIndex(folder => folder.name === folderName);
    if (folderIndex > -1) {
        users[email].folders.splice(folderIndex, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayDocuments();
    }
}

function deleteDocument(documentName) {
    const email = localStorage.getItem('email');
    const documentIndex = users[email].documents.findIndex(doc => doc.name === documentName);
    if (documentIndex > -1) {
        users[email].documents.splice(documentIndex, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayDocuments();
    }
}

function displayDocuments() {
    const email = localStorage.getItem('email');
    const documentsContainer = document.getElementById('documents-container');
    documentsContainer.innerHTML = '';

    const userFolders = users[email].folders || [];
    userFolders.forEach(folder => {
        const folderElement = document.createElement('div');
        folderElement.classList.add('folder');
        folderElement.textContent = folder.name;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteFolder(folder.name);

        folderElement.appendChild(deleteButton);
        documentsContainer.appendChild(folderElement);
    });

    const userDocuments = users[email].documents || [];
    userDocuments.forEach(doc => {
        const docElement = document.createElement('div');
        docElement.classList.add('document');
        docElement.textContent = doc.name;
        docElement.addEventListener('click', () => {
            doc.lastOpened = new Date();
            localStorage.setItem('users', JSON.stringify(users));
            openDocument(doc.fileContent);
            updateDocumentOverview();
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteDocument(doc.name);

        docElement.appendChild(deleteButton);
        documentsContainer.appendChild(docElement);
    });
}

function openDocument(url) {
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
        alert('Pop-up bloqueado. Habilita las ventanas emergentes para ver el archivo.');
    }
}

function moveDocumentToFolder(email, documentName) {
    const selectedFolder = prompt('Nombre de la carpeta a la que deseas mover el documento:');
    if (selectedFolder) {
        const folder = users[email].folders.find(f => f.name === selectedFolder);
        if (folder) {
            const documentIndex = users[email].documents.findIndex(doc => doc.name === documentName);
            if (documentIndex > -1) {
                const document = users[email].documents.splice(documentIndex, 1)[0];
                folder.documents.push(document);
                localStorage.setItem('users', JSON.stringify(users));
                displayDocuments();
            } else {
                alert('Documento no encontrado.');
            }
        } else {
            alert('Carpeta no encontrada.');
        }
    }
}

function updateDocumentOverview() {
    const email = localStorage.getItem('email');
    const userDocuments = users[email]?.documents || [];

    const documentList = document.getElementById('document-list');
    documentList.innerHTML = '';

    if (userDocuments.length === 0) {
        documentList.textContent = 'Sin documentos';
    } else {
        const lastOpenedDocuments = userDocuments.slice(-2);
        lastOpenedDocuments.forEach(doc => {
            const docElement = document.createElement('p');
            docElement.textContent = doc.name;
            documentList.appendChild(docElement);
        });
    }
}

function updateProfileIcon() {
    const email = localStorage.getItem('email');
    const profile = users[email].profile || {};
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        profileIcon.src = profile.profileImage || 'assets/default-profile.png';
    }
}

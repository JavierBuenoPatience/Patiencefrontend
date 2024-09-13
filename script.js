const users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;
const adminEmail = 'javibueda@gmail.com'; // Correo del administrador

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu-desplegable');
    const headerRight = document.querySelector('.header-right img');
    const dropdown = document.getElementById('profile-dropdown');

    if (localStorage.getItem('loggedIn') === 'true') {
        currentUser = users[localStorage.getItem('email')];
        showHomeScreen();
        menu.style.display = 'block';
        checkIfPasswordNeedsChange(); // Verificar si necesita cambiar contraseña temporal
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

    // Manejo de la subida de documentos
    document.getElementById('upload-document').addEventListener('change', uploadDocuments);

    // Mostrar pantalla de administración si es administrador
    const adminButton = document.getElementById('admin-panel-button');
    if (adminButton) {
        adminButton.addEventListener('click', showAdminPanel);
    }
});

// Redirigir a Typeform para el registro
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
    } else {
        showLoginScreen();
    }
}

function showAdminPanel() {
    if (localStorage.getItem('email') === adminEmail) {
        hideAllScreens();
        document.getElementById('admin-panel-screen').style.display = 'block';
    } else {
        alert('No tienes permiso para acceder a esta página.');
    }
}

function createNewUser(event) {
    event.preventDefault();
    const newUserEmail = document.getElementById('new-user-email').value;
    const newUserName = document.getElementById('new-user-name').value;
    const newUserPassword = document.getElementById('new-user-password').value;
    
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
        temporaryPassword: true // Señal de que el usuario debe cambiar su contraseña
    };

    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('admin-panel-form').reset();
    alert('Usuario creado con éxito.');
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

function redirectToIA(specialty) {
    if (specialty === 'biologia') {
        window.open('https://chatgpt.com/g/g-xgl7diXqb-patience-biologia-y-geologia', '_blank');
    } else {
        alert('La especialidad seleccionada estará disponible pronto.');
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
    if (localStorage.getItem('loggedIn') === 'true') {
        hideAllScreens();
        document.getElementById('guide-screen').style.display = 'block';
    } else {
        showLoginScreen();
    }
}

function showDirectory() {
    if (localStorage.getItem('loggedIn') === 'true') {
        hideAllScreens();
        document.getElementById('directory-screen').style.display = 'block';
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

    csifIframe.style.display = 'none';
    sipriIframe.style.display = 'none';

    if (newsType === 'csif') {
        csifIframe.style.display = 'block';
    } else if (newsType === 'sipri') {
        sipriIframe.style.display = 'block';
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

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.display = section.style.display === 'none' || section.style.display === '' ? 'block' : 'none';
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

// Función que abre el documento en una nueva pestaña utilizando su URL base64.
function openDocument(url) {
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
        alert('Pop-up bloqueado. Habilita las ventanas emergentes para ver el archivo.');
    }
}

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
                fileContent: e.target.result // Guardamos el contenido como una URL base64.
            };
            users[email].documents.push(documentData);
            localStorage.setItem('users', JSON.stringify(users));
            displayDocuments();
            updateDocumentOverview();
        };

        reader.readAsDataURL(file); // Leemos el archivo como una Data URL (base64).
    }
}

function createFolder() {
    const folderName = prompt('Nombre de la nueva carpeta:');
    if (folderName) {
        const folderData = {
            name: folderName,
            documents: []
        };
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
            openDocument(doc.fileContent); // Usamos el contenido base64 para abrir el documento.
            updateDocumentOverview();
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteDocument(doc.name);

        docElement.appendChild(deleteButton);
        documentsContainer.appendChild(docElement);
    });
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

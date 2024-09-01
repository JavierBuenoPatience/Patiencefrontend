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
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('registration-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('profile-screen').style.display = 'none';
    document.getElementById('groups-screen').style.display = 'none';
    document.getElementById('training-screen').style.display = 'none';
    document.getElementById('news-screen').style.display = 'none';
    document.getElementById('coming-soon-screen').style.display = 'none';
    document.getElementById('ia-specialized-screen').style.display = 'none';
    document.getElementById('help-screen').style.display = 'none';
    document.getElementById('documents-screen').style.display = 'none';
    document.getElementById('guide-screen').style.display = 'none';
    document.getElementById('directory-screen').style.display = 'none';
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
    const userDocuments = users[email].documents || [];

    const documentList = document.getElementById('document-list');
    documentList.innerHTML = '';

    if (userDocuments.length === 0) {
        documentList.textContent = 'Sin documentos';
    } else {
        const lastOpenedDocuments = userDocuments.filter(doc => doc.lastOpened).slice(-2);

        if (lastOpenedDocuments.length === 0) {
            const randomDocs = userDocuments.slice(0, 2);
            randomDocs.forEach(doc => {
                const docElement = document.createElement('p');
                docElement.textContent = doc.name;
                documentList.appendChild(docElement);
            });
        } else {
            lastOpenedDocuments.forEach(doc => {
                const docElement = document.createElement('p');
                docElement.textContent = doc.name;
                documentList.appendChild(docElement);
            });
        }
    }
}

function uploadDocuments() {
    const email = localStorage.getItem('email');
    const fileInput = document.getElementById('upload-document');
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const documentData = {
            name: file.name,
            lastOpened: null,
            folder: null,
            fileContent: ''
        };

        const reader = new FileReader();
        reader.onload = function (e) {
            documentData.fileContent = e.target.result;
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
            alert(`Abriendo documento: ${doc.name}`);
            updateDocumentOverview();
        });

        const moveButton = document.createElement('button');
        moveButton.textContent = 'Mover a carpeta';
        moveButton.style.marginTop = '5px';
        moveButton.onclick = () => {
            moveDocumentToFolder(email, doc.name);
        };

        docElement.appendChild(moveButton);
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

// Definimos constantes para colores y URLs
const COLORS = {
    primary: '#5D6D7E', // Azul grisáceo
    secondary: '#1ABC9C', // Turquesa
    accent: '#F2F4F4',    // Gris claro
    background: '#FFFFFF', // Blanco
    text: '#2C3E50'       // Gris oscuro
};

const URLS = {
    slack: 'https://join.slack.com/t/patienceespacio/shared_invite/zt-2obzf3sds-RhLnkRpDMbjK6oTAncR5BA'
};

// Obtenemos los usuarios almacenados o inicializamos uno vacío
const users = JSON.parse(localStorage.getItem('users')) || {};

// Datos de academias
const academies = [
    // (Los datos de las academias permanecen iguales)
];

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu-desplegable');
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

    // Manejo de la subida de documentos
    const uploadInput = document.getElementById('upload-document');
    if (uploadInput) {
        uploadInput.addEventListener('change', uploadDocuments);
    }

    // Manejo de búsqueda de documentos
    const documentSearch = document.getElementById('document-search');
    if (documentSearch) {
        documentSearch.addEventListener('input', filterDocuments);
    }

    // Inicializar academia
    initAcademyDirectory();
});

// Función genérica para mostrar pantallas
function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).style.display = 'block';
}

// Manejo de registro
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

    users[email] = {
        name,
        email,
        password,
        profile: {},
        documents: [],
        folders: [],
        studyHours: 0,
        examDate: null,
        lastDocument: null,
        annotations: {}
    };
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('registration-form').reset();
    document.getElementById('registration-message').style.display = 'block';
    document.getElementById('welcome-button').style.display = 'block';
}

// Manejo de inicio de sesión
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

// Manejo de cierre de sesión
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

// Manejo de actualización de perfil
function handleProfileUpdate(event) {
    event.preventDefault();
    const email = localStorage.getItem('email');
    const profile = {
        fullName: document.getElementById('full-name').value,
        phone: document.getElementById('phone').value,
        studyTime: parseInt(document.getElementById('study-time').value) || 0,
        examDate: document.getElementById('exam-date').value,
        specialty: document.getElementById('specialty').value,
        hobbies: document.getElementById('hobbies').value,
        location: document.getElementById('location').value,
        profileImage: document.getElementById('profile-img').src
    };
    users[email].profile = profile;
    users[email].studyHours = profile.studyTime;
    users[email].examDate = profile.examDate;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Perfil actualizado con éxito');
    updateProfileIcon();
    updateDashboard();
}

// Validación de email
function validateEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const hotmailRegex = /^[a-zA-Z0-9._%+-]+@(hotmail|outlook)\.com$/;
    return gmailRegex.test(email) || hotmailRegex.test(email);
}

// Mostrar pantalla de inicio de sesión
function showLoginScreen() {
    showScreen('login-screen');
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
}

// Mostrar pantalla de registro
function showRegistrationScreen() {
    showScreen('registration-screen');
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
}

// Mostrar pantalla de inicio
function showHomeScreen() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('home-screen');
        document.getElementById('user-name-home').textContent = localStorage.getItem('name');
        document.querySelector('header').style.display = 'flex';
        document.querySelector('footer').style.display = 'block';
        updateProfileIcon();
        updateDocumentOverview();
        updateDashboard();
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de perfil
function showProfile() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('profile-screen');
        const email = localStorage.getItem('email');
        const profile = users[email].profile || {};
        document.getElementById('full-name').value = profile.fullName || '';
        document.getElementById('phone').value = profile.phone || '';
        document.getElementById('study-time').value = profile.studyTime || '';
        document.getElementById('exam-date').value = profile.examDate || '';
        document.getElementById('specialty').value = profile.specialty || '';
        document.getElementById('hobbies').value = profile.hobbies || '';
        document.getElementById('location').value = profile.location || '';
        document.getElementById('profile-img').src = profile.profileImage || 'assets/default-profile.png';
        document.getElementById('profile-email').value = email;
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de IA Especializada
function showAIScreen() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('ai-screen');
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de documentos
function showDocuments() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('documents-screen');
        displayDocuments();
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de grupos
function showGroups() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('groups-screen');
    } else {
        showLoginScreen();
    }
}

// Función para redirigir a Slack
function redirectToSlack() {
    window.open(URLS.slack, '_blank');
}

// Mostrar pantalla de ¿Qué es Patience?
function showTraining() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('training-screen');
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de Guía de IA
function showGuideScreen() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('guide-screen');
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de ¿Dónde te puedes preparar?
function showDirectoryScreen() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('directory-screen');
        renderAcademies();
    } else {
        showLoginScreen();
    }
}

// Inicializar el directorio de academias
function initAcademyDirectory() {
    populateFilters();
    renderAcademies();
}

// Poblar los filtros de ciudad y especialidad
function populateFilters() {
    const cityFilter = document.getElementById('city-filter');
    const specialtyFilter = document.getElementById('specialty-filter');

    const cities = [...new Set(academies.map(a => a.city))];
    const specialties = [...new Set(academies.flatMap(a => a.specialties))];

    cities.sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });

    specialties.sort().forEach(spec => {
        const option = document.createElement('option');
        option.value = spec;
        option.textContent = spec;
        specialtyFilter.appendChild(option);
    });
}

// Filtrar y renderizar academias
function filterAcademies() {
    const city = document.getElementById('city-filter').value;
    const specialty = document.getElementById('specialty-filter').value;

    let filteredAcademies = academies;

    if (city) {
        filteredAcademies = filteredAcademies.filter(a => a.city === city);
    }

    if (specialty) {
        filteredAcademies = filteredAcademies.filter(a => a.specialties.includes(specialty));
    }

    renderAcademies(filteredAcademies);
}

// Renderizar academias
function renderAcademies(academyList = academies) {
    const academyContainer = document.getElementById('academy-container');
    academyContainer.innerHTML = '';

    if (academyList.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No se encontraron academias con los filtros seleccionados.';
        academyContainer.appendChild(noResults);
        return;
    }

    academyList.forEach(academy => {
        const academyCard = document.createElement('div');
        academyCard.classList.add('academy-card');

        const header = document.createElement('div');
        header.classList.add('academy-header');
        const name = document.createElement('h3');
        name.textContent = academy.name;
        const rating = document.createElement('span');
        rating.textContent = academy.rating;
        header.appendChild(name);
        header.appendChild(rating);

        const info = document.createElement('div');
        info.classList.add('academy-info');
        info.innerHTML = `
            <p><strong>Ciudad:</strong> ${academy.city}</p>
            <p><strong>Teléfono:</strong> ${academy.phone}</p>
            <p><strong>Email:</strong> ${academy.email}</p>
            <p><strong>Especialidades:</strong> ${academy.specialties.join(', ')}</p>
        `;

        const annotationSection = document.createElement('div');
        annotationSection.classList.add('annotation-section');
        const annotationLabel = document.createElement('label');
        annotationLabel.textContent = 'Anotaciones:';
        const annotationTextarea = document.createElement('textarea');
        annotationTextarea.rows = 3;
        annotationTextarea.placeholder = 'Escribe tus anotaciones aquí...';
        annotationTextarea.value = getUserAnnotation(academy.name);
        annotationTextarea.addEventListener('input', () => {
            saveUserAnnotation(academy.name, annotationTextarea.value);
        });

        annotationSection.appendChild(annotationLabel);
        annotationSection.appendChild(annotationTextarea);

        academyCard.appendChild(header);
        academyCard.appendChild(info);
        academyCard.appendChild(annotationSection);

        academyContainer.appendChild(academyCard);
    });
}

// Obtener anotaciones del usuario para una academia
function getUserAnnotation(academyName) {
    const email = localStorage.getItem('email');
    if (users[email] && users[email].annotations && users[email].annotations[academyName]) {
        return users[email].annotations[academyName];
    }
    return '';
}

// Guardar anotaciones del usuario para una academia
function saveUserAnnotation(academyName, annotation) {
    const email = localStorage.getItem('email');
    if (!users[email].annotations) {
        users[email].annotations = {};
    }
    users[email].annotations[academyName] = annotation;
    localStorage.setItem('users', JSON.stringify(users));
}

// Mostrar pantalla de Próximamente
function showComingSoon() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('coming-soon-screen');
    } else {
        showLoginScreen();
    }
}

// Mostrar pantalla de noticias
function showNews() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('news-screen');
        showNewsContent('csif'); // Mostrar CSIF por defecto
    } else {
        showLoginScreen();
    }
}

// Mostrar contenido de noticias
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

// Mostrar pantalla de ayuda
function showHelp() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showScreen('help-screen');
    } else {
        showLoginScreen();
    }
}

// Función para ocultar todas las pantallas
function hideAllScreens() {
    const screens = document.querySelectorAll('.card');
    screens.forEach(screen => screen.style.display = 'none');
}

// Función para actualizar el icono de perfil
function updateProfileIcon() {
    const email = localStorage.getItem('email');
    const profile = users[email].profile || {};
    const profileIcon = document.getElementById('profile-icon');
    if (profileIcon) {
        profileIcon.src = profile.profileImage || 'assets/default-profile.png';
    }
}

// Función para actualizar el dashboard
function updateDashboard() {
    const email = localStorage.getItem('email');
    const user = users[email];
    const daysRemainingElement = document.getElementById('days-remaining');
    const studyHoursElement = document.getElementById('study-hours');
    const lastDocumentElement = document.getElementById('last-document');

    // Días restantes para el examen
    if (user.examDate) {
        const examDate = new Date(user.examDate);
        const today = new Date();
        const timeDiff = examDate - today;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        daysRemainingElement.textContent = daysRemaining > 0 ? daysRemaining + ' días' : 'Examen pasado';
    } else {
        daysRemainingElement.textContent = '--';
    }

    // Horas de estudio
    studyHoursElement.textContent = user.studyHours ? user.studyHours + ' horas' : '--';

    // Último documento abierto
    lastDocumentElement.textContent = user.lastDocument || '--';
}

// Función para manejar el clic en el logo
function handleLogoClick() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showHomeScreen();
    } else {
        showLoginScreen();
    }
}

// Manejo de subida de imagen de perfil
function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('profile-img').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Función para actualizar la vista de documentos recientes
function updateDocumentOverview() {
    const email = localStorage.getItem('email');
    const userDocuments = users[email]?.documents || [];

    const documentList = document.getElementById('document-list');
    if (documentList) {
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
}

// Función para subir documentos
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
                fileContent: e.target.result,
                fileType: file.type
            };
            users[email].documents.push(documentData);
            localStorage.setItem('users', JSON.stringify(users));
            displayDocuments();
            updateDocumentOverview();
        };

        reader.readAsDataURL(file);
    }
}

// Función para crear carpeta
function createFolder() {
    const folderName = prompt('Nombre de la nueva carpeta:');
    if (folderName) {
        const email = localStorage.getItem('email');
        if (!users[email].folders) {
            users[email].folders = [];
        }
        const folderData = {
            name: folderName,
            documents: []
        };
        users[email].folders.push(folderData);
        localStorage.setItem('users', JSON.stringify(users));
        displayDocuments();
    }
}

// Función para eliminar carpeta
function deleteFolder(folderName) {
    const email = localStorage.getItem('email');
    const folderIndex = users[email].folders.findIndex(folder => folder.name === folderName);
    if (folderIndex > -1) {
        users[email].folders.splice(folderIndex, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayDocuments();
    }
}

// Función para mostrar documentos
function displayDocuments() {
    const email = localStorage.getItem('email');
    const documentsContainer = document.getElementById('documents-container');
    documentsContainer.innerHTML = '';

    const userFolders = users[email].folders || [];
    userFolders.forEach(folder => {
        const folderElement = document.createElement('div');
        folderElement.classList.add('folder-card');
        const folderHeader = document.createElement('div');
        folderHeader.classList.add('folder-header');
        folderHeader.textContent = folder.name;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteFolder(folder.name);

        folderHeader.appendChild(deleteButton);
        folderElement.appendChild(folderHeader);

        // Mostrar documentos dentro de la carpeta
        const folderDocuments = document.createElement('div');
        folderDocuments.classList.add('folder-documents');

        folder.documents.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.classList.add('document-card');
            docElement.innerHTML = `<i class="fas fa-file-alt"></i> ${doc.name}`;
            docElement.addEventListener('click', () => {
                openDocument(email, doc);
            });
            folderDocuments.appendChild(docElement);
        });

        folderElement.appendChild(folderDocuments);
        documentsContainer.appendChild(folderElement);
    });

    const userDocuments = users[email].documents || [];
    userDocuments.forEach(doc => {
        const docElement = document.createElement('div');
        docElement.classList.add('document-card');
        docElement.innerHTML = `<i class="fas fa-file-alt"></i> ${doc.name}`;
        docElement.addEventListener('click', () => {
            openDocument(email, doc);
        });

        const moveButton = document.createElement('button');
        moveButton.innerHTML = '<i class="fas fa-folder"></i>';
        moveButton.onclick = (e) => {
            e.stopPropagation();
            moveDocumentToFolder(email, doc.name);
        };

        docElement.appendChild(moveButton);
        documentsContainer.appendChild(docElement);
    });
}

// Función para abrir documento
function openDocument(email, doc) {
    doc.lastOpened = new Date();
    users[email].lastDocument = doc.name;
    localStorage.setItem('users', JSON.stringify(users));

    // Crear un blob y abrir en una nueva ventana
    const byteCharacters = atob(doc.fileContent.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.fileType });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');

    updateDocumentOverview();
}

// Función para mover documento a carpeta
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

// Función para filtrar documentos
function filterDocuments() {
    const searchTerm = document.getElementById('document-search').value.toLowerCase();
    const email = localStorage.getItem('email');
    const documentsContainer = document.getElementById('documents-container');
    documentsContainer.innerHTML = '';

    const userDocuments = users[email].documents || [];
    const filteredDocuments = userDocuments.filter(doc => doc.name.toLowerCase().includes(searchTerm));

    filteredDocuments.forEach(doc => {
        const docElement = document.createElement('div');
        docElement.classList.add('document-card');
        docElement.innerHTML = `<i class="fas fa-file-alt"></i> ${doc.name}`;
        docElement.addEventListener('click', () => {
            openDocument(email, doc);
        });

        documentsContainer.appendChild(docElement);
    });
}

// Función para alternar el menú en dispositivos móviles
function toggleMenu() {
    const menu = document.getElementById('menu-desplegable');
    menu.classList.toggle('show-menu');
}

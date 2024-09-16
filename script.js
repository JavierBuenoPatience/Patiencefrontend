(function() {
    // Encapsulamos el código en una función autoejecutable para evitar variables globales

    const adminEmail = 'javibueda@gmail.com'; // Correo del administrador
    const adminPassword = '123456789'; // Contraseña del administrador

    let users = {
        [adminEmail]: {
            name: 'Javier',
            password: hashPassword(adminPassword),
            profile: {},
            documents: [],
            folders: [],
            temporaryPassword: false,
            registeredAt: new Date().toISOString()
        }
    };
    let currentUser = null;

    // Manejo seguro de la obtención de usuarios desde localStorage
    try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            users = { ...users, ...parsedUsers }; // Fusionar usuarios existentes con el administrador
        }
    } catch (e) {
        console.error('Error al parsear los usuarios del localStorage', e);
        localStorage.removeItem('users');
    }

    // Guardar el objeto users actualizado en localStorage
    localStorage.setItem('users', JSON.stringify(users));

    document.addEventListener('DOMContentLoaded', () => {
        const profileIcon = document.getElementById('profile-icon');
        const dropdown = document.getElementById('profile-dropdown');
        const menu = document.getElementById('menu-desplegable');
        const headerRight = document.getElementById('header-right');

        // Mostrar u ocultar el menú desplegable del perfil
        if (profileIcon && dropdown) {
            profileIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                dropdown.classList.toggle('show-dropdown');
            });

            // Cerrar el dropdown si se hace clic fuera de él
            document.addEventListener('click', (event) => {
                if (!profileIcon.contains(event.target) && !dropdown.contains(event.target)) {
                    dropdown.classList.remove('show-dropdown');
                }
            });
        }

        // Verificar si el usuario ha iniciado sesión
        if (localStorage.getItem('loggedIn') === 'true') {
            currentUser = users[localStorage.getItem('email')];
            if (currentUser) {
                showHomeScreen();
                if (menu) menu.style.display = 'flex';
                checkIfPasswordNeedsChange(); // Verificar si necesita cambiar contraseña temporal
            } else {
                // Si el usuario no se encuentra, cerrar sesión
                handleLogout();
            }
        } else {
            showLoginScreen();
            if (menu) menu.style.display = 'none';
        }

        // Manejo de la subida de documentos
        const uploadDocumentElement = document.getElementById('upload-document');
        if (uploadDocumentElement) {
            uploadDocumentElement.addEventListener('change', uploadDocuments);
        }

        // Event listeners para botones del menú
        const inicioButton = document.getElementById('inicio-button');
        if (inicioButton) inicioButton.addEventListener('click', showHomeScreen);

        const perfilButton = document.getElementById('perfil-button');
        if (perfilButton) perfilButton.addEventListener('click', showProfile);

        const iaButton = document.getElementById('ia-button');
        if (iaButton) iaButton.addEventListener('click', showIASpecializedOptions);

        const gruposButton = document.getElementById('grupos-button');
        if (gruposButton) gruposButton.addEventListener('click', showGroups);

        const documentosButton = document.getElementById('documentos-button');
        if (documentosButton) documentosButton.addEventListener('click', showDocuments);

        const trainingButton = document.getElementById('training-button');
        if (trainingButton) trainingButton.addEventListener('click', showTraining);

        const centroButton = document.getElementById('centro-button');
        if (centroButton) centroButton.addEventListener('click', showComingSoon);

        const noticiasButton = document.getElementById('noticias-button');
        if (noticiasButton) noticiasButton.addEventListener('click', showNews);

        const adminButton = document.getElementById('admin-button');
        if (adminButton) adminButton.addEventListener('click', showAdminPanel);

        // Event listeners para otros botones
        const registerButton = document.getElementById('register-button');
        if (registerButton) registerButton.addEventListener('click', redirectToTypeform);

        const slackButton = document.getElementById('slack-button');
        if (slackButton) slackButton.addEventListener('click', () => redirectToURL('https://join.slack.com/t/patienceespacio/shared_invite/zt-1v8qj5xip-1Tc4qYv~oOx3xJp9jEq8pg'));

        const slackButtonGroups = document.getElementById('slack-button-groups');
        if (slackButtonGroups) slackButtonGroups.addEventListener('click', () => redirectToURL('https://join.slack.com/t/patienceespacio/shared_invite/zt-1v8qj5xip-1Tc4qYv~oOx3xJp9jEq8pg'));

        const slackButtonHelp = document.getElementById('slack-button-help');
        if (slackButtonHelp) slackButtonHelp.addEventListener('click', () => redirectToURL('https://join.slack.com/t/patienceespacio/shared_invite/zt-1v8qj5xip-1Tc4qYv~oOx3xJp9jEq8pg'));

        const guideButton = document.getElementById('guide-button');
        if (guideButton) guideButton.addEventListener('click', showGuide);

        const directoryButton = document.getElementById('directory-button');
        if (directoryButton) directoryButton.addEventListener('click', showDirectory);

        const helpButton = document.getElementById('help-button');
        if (helpButton) helpButton.addEventListener('click', showHelp);

        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);

        // Event listeners para los botones de noticias
        const csifButton = document.getElementById('csif-button');
        if (csifButton) csifButton.addEventListener('click', () => showNewsContent('csif'));

        const sipriButton = document.getElementById('sipri-button');
        if (sipriButton) sipriButton.addEventListener('click', () => showNewsContent('sipri'));

        // Event listeners para la sección de ayuda
        const faqsButton = document.getElementById('faqs-button');
        if (faqsButton) faqsButton.addEventListener('click', () => toggleSection('faqs-section'));

        const contactButton = document.getElementById('contact-button');
        if (contactButton) contactButton.addEventListener('click', () => toggleSection('contact-section'));

        // Event listeners para los botones de IA especializada
        const biologiaButton = document.getElementById('biologia-button');
        if (biologiaButton) biologiaButton.addEventListener('click', () => redirectToIA('biologia'));

        const inglesButton = document.getElementById('ingles-button');
        if (inglesButton) inglesButton.addEventListener('click', () => redirectToIA('ingles'));

        const lenguaButton = document.getElementById('lengua-button');
        if (lenguaButton) lenguaButton.addEventListener('click', () => redirectToIA('lengua'));

        const matematicasButton = document.getElementById('matematicas-button');
        if (matematicasButton) matematicasButton.addEventListener('click', () => redirectToIA('matematicas'));

        // Manejo del formulario de inicio de sesión
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Manejo del formulario de cambio de contraseña
        const passwordChangeForm = document.getElementById('password-change-form');
        if (passwordChangeForm) {
            passwordChangeForm.addEventListener('submit', handleFirstPasswordChange);
        }

        // Manejo del formulario de perfil
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileUpdate);
        }

        // Manejo del formulario de crear usuario (panel de administración)
        const createUserForm = document.getElementById('create-user-form');
        if (createUserForm) {
            createUserForm.addEventListener('submit', createNewUser);
        }

        // Manejo de la imagen de perfil
        const profileImageInput = document.getElementById('profile-image-input');
        if (profileImageInput) {
            profileImageInput.addEventListener('change', handleImageUpload);
        }

        // Manejo del logo para volver al inicio
        const logo = document.getElementById('logo');
        if (logo) {
            logo.addEventListener('click', handleLogoClick);
        }

        // Event listener para el botón de crear carpeta en documentos
        const createFolderButton = document.getElementById('create-folder-button');
        if (createFolderButton) createFolderButton.addEventListener('click', createFolder);

        // Event listeners para los recuadros en la pantalla de inicio
        const homeGuideButton = document.getElementById('guide-button-home');
        if (homeGuideButton) homeGuideButton.addEventListener('click', showGuide);

        const homeDirectoryButton = document.getElementById('directory-button-home');
        if (homeDirectoryButton) homeDirectoryButton.addEventListener('click', showDirectory);

        // Añade aquí otros event listeners necesarios para tus funcionalidades
    });

    // Función para redirigir al registro en Typeform
    function redirectToTypeform() {
        window.location.href = "https://qz232a8zljw.typeform.com/to/AHskzuV5?typeform-source=javierbuenopatience.github.io";
    }

    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (users[email] && verifyPassword(password, users[email].password)) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('email', email);
            currentUser = users[email];
            showHomeScreen();
            const menu = document.getElementById('menu-desplegable');
            if (menu) menu.style.display = 'flex';
            checkIfPasswordNeedsChange();
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    }

    function checkIfPasswordNeedsChange() {
        if (currentUser && currentUser.temporaryPassword) {
            const passwordChangePopup = document.getElementById('password-change-popup');
            if (passwordChangePopup) {
                passwordChangePopup.style.display = 'flex';
            }
        }
    }

    function handleFirstPasswordChange(event) {
        event.preventDefault();
        const newPassword = document.getElementById('new-password').value;

        if (currentUser) {
            currentUser.password = hashPassword(newPassword);
            delete currentUser.temporaryPassword;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Contraseña cambiada con éxito.');
            const passwordChangePopup = document.getElementById('password-change-popup');
            if (passwordChangePopup) {
                passwordChangePopup.style.display = 'none';
            }
        }
    }

    function handleLogout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('email');
        currentUser = null;
        hideAllScreens();
        showLoginScreen();
        const menu = document.getElementById('menu-desplegable');
        if (menu) menu.style.display = 'none';
    }

    function handleProfileUpdate(event) {
        event.preventDefault();
        const email = localStorage.getItem('email');
        const profileImgElement = document.getElementById('profile-img');
        const profile = {
            fullName: document.getElementById('full-name').value,
            phone: document.getElementById('phone').value,
            studyTime: document.getElementById('study-time').value,
            specialty: document.getElementById('specialty').value,
            hobbies: document.getElementById('hobbies').value,
            location: document.getElementById('location').value,
            profileImage: profileImgElement ? profileImgElement.src : 'assets/default-profile.png'
        };
        if (users[email]) {
            users[email].profile = profile;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Perfil actualizado con éxito');
            updateProfileIcon();
        } else {
            alert('Usuario no encontrado.');
        }
    }

    function validateEmail(email) {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const hotmailRegex = /^[a-zA-Z0-9._%+-]+@hotmail\.com$/;
        return gmailRegex.test(email) || hotmailRegex.test(email);
    }

    function showLoginScreen() {
        hideAllScreens();
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) loginScreen.style.display = 'block';
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
    }

    function showHomeScreen() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const homeScreen = document.getElementById('home-screen');
            if (homeScreen) homeScreen.style.display = 'block';
            const userNameHome = document.getElementById('user-name-home');
            if (userNameHome && currentUser) userNameHome.textContent = currentUser.name || '';
            const header = document.querySelector('header');
            const footer = document.querySelector('footer');
            if (header) header.style.display = 'flex';
            if (footer) footer.style.display = 'block';
            const menu = document.getElementById('menu-desplegable');
            if (menu) menu.style.display = 'flex';
            updateProfileIcon();
            updateDocumentOverview();
        } else {
            showLoginScreen();
        }
    }

    function showAdminPanel() {
        const email = localStorage.getItem('email');
        if (email === adminEmail) {
            hideAllScreens();
            const adminPanel = document.getElementById('admin-panel');
            if (adminPanel) adminPanel.style.display = 'block';
            updateUserList();
        } else {
            alert('No tienes permiso para acceder a esta página.');
        }
    }

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
            password: hashPassword(newUserPassword),
            profile: {},
            documents: [],
            folders: [],
            temporaryPassword: true,
            registeredAt: new Date().toISOString()
        };

        localStorage.setItem('users', JSON.stringify(users));
        const createUserForm = document.getElementById('create-user-form');
        if (createUserForm) createUserForm.reset();
        alert('Usuario creado con éxito.');
        updateUserList();
    }

    function updateUserList() {
        const userListContainer = document.getElementById('user-list');
        if (userListContainer) {
            userListContainer.innerHTML = '';

            Object.keys(users).forEach(email => {
                const user = users[email];
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = user.name || 'N/A';
                const emailCell = document.createElement('td');
                emailCell.textContent = email;
                const dateCell = document.createElement('td');
                dateCell.textContent = user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'N/A';

                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(dateCell);

                userListContainer.appendChild(row);
            });
        }
    }

    function showProfile() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const profileScreen = document.getElementById('profile-screen');
            if (profileScreen) profileScreen.style.display = 'block';
            const email = localStorage.getItem('email');
            const profile = users[email].profile || {};
            document.getElementById('full-name').value = profile.fullName || '';
            document.getElementById('profile-email').value = email || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('study-time').value = profile.studyTime || '';
            document.getElementById('specialty').value = profile.specialty || '';
            document.getElementById('hobbies').value = profile.hobbies || '';
            document.getElementById('location').value = profile.location || '';
            const profileImg = document.getElementById('profile-img');
            if (profileImg) profileImg.src = profile.profileImage || 'assets/default-profile.png';
        } else {
            showLoginScreen();
        }
    }

    function showGroups() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const groupsScreen = document.getElementById('groups-screen');
            if (groupsScreen) groupsScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function showIASpecializedOptions() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const iaSpecializedScreen = document.getElementById('ia-specialized-screen');
            if (iaSpecializedScreen) iaSpecializedScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function redirectToIA(specialty) {
        if (localStorage.getItem('loggedIn') === 'true') {
            if (specialty === 'biologia') {
                window.open('https://chatgpt.com/g/g-xgl7diXqb-patience-biologia-y-geologia', '_blank');
            } else {
                alert('La especialidad seleccionada estará disponible pronto.');
            }
        } else {
            alert('Por favor, inicia sesión para acceder a esta funcionalidad.');
            showLoginScreen();
        }
    }

    function showTraining() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const trainingScreen = document.getElementById('training-screen');
            if (trainingScreen) trainingScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function showComingSoon() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const comingSoonScreen = document.getElementById('coming-soon-screen');
            if (comingSoonScreen) comingSoonScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function showNews() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const newsScreen = document.getElementById('news-screen');
            if (newsScreen) newsScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function showDocuments() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const documentsScreen = document.getElementById('documents-screen');
            if (documentsScreen) documentsScreen.style.display = 'block';
            displayDocuments();
        } else {
            showLoginScreen();
        }
    }

    function showGuide() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const guideScreen = document.getElementById('guide-screen');
            if (guideScreen) guideScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function showDirectory() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const directoryScreen = document.getElementById('directory-screen');
            if (directoryScreen) directoryScreen.style.display = 'block';
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
            const profileImg = document.getElementById('profile-img');
            if (profileImg) {
                profileImg.src = e.target.result;
            }
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    function updateProfileIcon() {
        const email = localStorage.getItem('email');
        const profile = users[email]?.profile || {};
        const profileIcon = document.getElementById('profile-icon');
        if (profileIcon) {
            profileIcon.src = profile.profileImage || 'assets/default-profile.png';
        }
    }

    function showNewsContent(newsType) {
        const csifIframe = document.getElementById('csif-iframe');
        const sipriIframe = document.getElementById('sipri-iframe');

        if (csifIframe) csifIframe.style.display = 'none';
        if (sipriIframe) sipriIframe.style.display = 'none';

        if (newsType === 'csif' && csifIframe) {
            csifIframe.style.display = 'block';
        } else if (newsType === 'sipri' && sipriIframe) {
            sipriIframe.style.display = 'block';
        }
    }

    function showHelp() {
        if (localStorage.getItem('loggedIn') === 'true') {
            hideAllScreens();
            const helpScreen = document.getElementById('help-screen');
            if (helpScreen) helpScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = section.style.display === 'none' || section.style.display === '' ? 'block' : 'none';
        }
    }

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
                    id: generateUniqueId(),
                    name: file.name,
                    lastOpened: null,
                    folderId: null, // Indica que está en la raíz
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
                id: generateUniqueId(),
                name: folderName,
                parentId: null, // Para futuras expansiones con subcarpetas
                documents: []
            };
            const email = localStorage.getItem('email');
            if (!users[email].folders) {
                users[email].folders = [];
            }
            users[email].folders.push(folderData);
            localStorage.setItem('users', JSON.stringify(users));
            displayDocuments();
        }
    }

    function deleteFolder(folderId) {
        const email = localStorage.getItem('email');
        const folderIndex = users[email].folders.findIndex(folder => folder.id === folderId);
        if (folderIndex > -1) {
            users[email].folders.splice(folderIndex, 1);
            // También eliminar documentos asociados a la carpeta
            users[email].documents = users[email].documents.filter(doc => doc.folderId !== folderId);
            localStorage.setItem('users', JSON.stringify(users));
            displayDocuments();
        }
    }

    function deleteDocument(documentId) {
        const email = localStorage.getItem('email');
        const documentIndex = users[email].documents.findIndex(doc => doc.id === documentId);
        if (documentIndex > -1) {
            users[email].documents.splice(documentIndex, 1);
            localStorage.setItem('users', JSON.stringify(users));
            displayDocuments();
            updateDocumentOverview();
        }
    }

    function displayDocuments() {
        const email = localStorage.getItem('email');
        const documentsContainer = document.getElementById('documents-container');
        if (documentsContainer) {
            documentsContainer.innerHTML = '';

            const rootFolders = users[email].folders.filter(folder => folder.parentId === null);
            const rootDocuments = users[email].documents.filter(doc => doc.folderId === null);

            // Mostrar carpetas raíz
            rootFolders.forEach(folder => {
                const folderElement = createFolderElement(folder);
                documentsContainer.appendChild(folderElement);
            });

            // Mostrar documentos en la raíz
            rootDocuments.forEach(doc => {
                const docElement = createDocumentElement(doc);
                documentsContainer.appendChild(docElement);
            });
        }
    }

    function createFolderElement(folder) {
        const folderElement = document.createElement('div');
        folderElement.classList.add('folder');
        folderElement.innerHTML = `<i class="fas fa-folder"></i> ${folder.name}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = (event) => {
            event.stopPropagation();
            if (confirm('¿Estás seguro de que deseas eliminar esta carpeta y todos sus contenidos?')) {
                deleteFolder(folder.id);
            }
        };

        const openButton = document.createElement('button');
        openButton.innerHTML = '<i class="fas fa-folder-open"></i>';
        openButton.onclick = (event) => {
            event.stopPropagation();
            openFolder(folder.id);
        };

        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions-container');
        actionsContainer.appendChild(openButton);
        actionsContainer.appendChild(deleteButton);

        folderElement.appendChild(actionsContainer);
        return folderElement;
    }

    function createDocumentElement(doc) {
        const docElement = document.createElement('div');
        docElement.classList.add('document');
        docElement.innerHTML = `<i class="fas fa-file"></i> ${doc.name}`;

        docElement.addEventListener('click', () => {
            doc.lastOpened = new Date();
            localStorage.setItem('users', JSON.stringify(users));
            openDocument(doc.fileContent); // Usamos el contenido base64 para abrir el documento.
            updateDocumentOverview();
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = (event) => {
            event.stopPropagation(); // Evitar que se abra el documento al hacer clic en borrar
            if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
                deleteDocument(doc.id);
            }
        };

        const moveButton = document.createElement('button');
        moveButton.innerHTML = '<i class="fas fa-arrows-alt"></i>';
        moveButton.onclick = (event) => {
            event.stopPropagation();
            moveDocument(doc.id);
        };

        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('actions-container');
        actionsContainer.appendChild(moveButton);
        actionsContainer.appendChild(deleteButton);

        docElement.appendChild(actionsContainer);
        return docElement;
    }

    function openFolder(folderId) {
        const email = localStorage.getItem('email');
        const folder = users[email].folders.find(f => f.id === folderId);
        if (folder) {
            const documentsContainer = document.getElementById('documents-container');
            if (documentsContainer) {
                documentsContainer.innerHTML = '';

                // Botón para regresar a la raíz
                const backButton = document.createElement('button');
                backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Volver';
                backButton.onclick = displayDocuments;
                documentsContainer.appendChild(backButton);

                // Mostrar carpetas dentro de esta carpeta
                const subFolders = users[email].folders.filter(f => f.parentId === folderId);
                subFolders.forEach(subFolder => {
                    const folderElement = createFolderElement(subFolder);
                    documentsContainer.appendChild(folderElement);
                });

                // Mostrar documentos dentro de esta carpeta
                const folderDocuments = users[email].documents.filter(doc => doc.folderId === folderId);
                folderDocuments.forEach(doc => {
                    const docElement = createDocumentElement(doc);
                    documentsContainer.appendChild(docElement);
                });
            }
        } else {
            alert('Carpeta no encontrada.');
        }
    }

    function moveDocument(documentId) {
        const email = localStorage.getItem('email');
        const document = users[email].documents.find(doc => doc.id === documentId);
        if (document) {
            const folderName = prompt('Nombre de la carpeta a la que deseas mover el documento:');
            if (folderName) {
                const folder = users[email].folders.find(f => f.name === folderName);
                if (folder) {
                    document.folderId = folder.id;
                    localStorage.setItem('users', JSON.stringify(users));
                    displayDocuments();
                } else {
                    alert('Carpeta no encontrada.');
                }
            }
        } else {
            alert('Documento no encontrado.');
        }
    }

    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Función para hashear contraseñas (ejemplo simplificado, no usar en producción)
    function hashPassword(password) {
        return btoa(password); // Codificación Base64 como placeholder
    }

    function verifyPassword(inputPassword, storedPasswordHash) {
        return hashPassword(inputPassword) === storedPasswordHash;
    }

})();

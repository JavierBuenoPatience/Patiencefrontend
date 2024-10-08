(function() {
    // Encapsulamos el código en una función autoejecutable para evitar variables globales

    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDpCwvvgd047aMQj3wvnGZRULklq04OqKM",
        authDomain: "patience-b1063.firebaseapp.com",
        projectId: "patience-b1063",
        storageBucket: "patience-b1063.appspot.com",
        messagingSenderId: "733466730686",
        appId: "1:733466730686:web:de1e1f8fa8783491ecbeef",
        measurementId: "G-TD50WYPDTC"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore();

    let currentUser = null;

    document.addEventListener('DOMContentLoaded', () => {
        const profileIcon = document.getElementById('profile-icon');
        const dropdown = document.getElementById('profile-dropdown');
        const menu = document.getElementById('menu-desplegable');

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

        // Manejo del estado de sesión
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    currentUser.role = userDoc.data().role;
                } else {
                    currentUser.role = 'user';
                }
                showHomeScreen();
                if (menu) menu.style.display = 'flex';
                if (currentUser.role === 'superadmin') {
                    document.getElementById('admin-button').style.display = 'block';
                }
            } else {
                currentUser = null;
                showLoginScreen();
                if (menu) menu.style.display = 'none';
            }
        });

        // Manejo del formulario de inicio de sesión
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Manejo del formulario de registro
        const registerButton = document.getElementById('register-button');
        if (registerButton) {
            registerButton.addEventListener('click', handleRegister);
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

        const adminButton = document.getElementById('admin-button');
        if (adminButton) adminButton.addEventListener('click', showAdminPanel);

        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);

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
    });

    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                currentUser = userCredential.user;
                showHomeScreen();
                const menu = document.getElementById('menu-desplegable');
                if (menu) menu.style.display = 'flex';
            })
            .catch((error) => {
                console.error("Error al iniciar sesión:", error.message);
                alert('Correo o contraseña incorrectos.');
            });
    }

    function handleRegister() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                currentUser = userCredential.user;
                await setDoc(doc(db, "users", currentUser.uid), {
                    email: currentUser.email,
                    role: 'user'
                });
                alert('Registro exitoso, ahora puedes iniciar sesión.');
                showLoginScreen();
            })
            .catch((error) => {
                console.error("Error al registrar:", error.message);
                alert('No se pudo completar el registro.');
            });
    }

    function handleLogout() {
        signOut(auth).then(() => {
            console.log("Usuario deslogueado");
            currentUser = null;
            showLoginScreen();
            const menu = document.getElementById('menu-desplegable');
            if (menu) menu.style.display = 'none';
        }).catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
    }

    async function createNewUser(event) {
        event.preventDefault();

        const newUserEmail = document.getElementById('new-user-email').value;
        const newUserName = document.getElementById('new-user-name').value;
        const newUserPassword = document.getElementById('new-user-password').value;

        if (!newUserEmail || !newUserName || !newUserPassword) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
            const newUser = userCredential.user;
            await setDoc(doc(db, "users", newUser.uid), {
                name: newUserName,
                email: newUserEmail,
                role: 'user',
                registeredAt: new Date().toISOString()
            });
            alert('Usuario creado con éxito.');
            updateUserList();
        } catch (error) {
            console.error("Error al crear usuario:", error.message);
            alert('No se pudo crear el usuario.');
        }
    }

    async function updateUserList() {
        const userListContainer = document.getElementById('user-list');
        if (userListContainer) {
            userListContainer.innerHTML = '';
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = user.name || 'N/A';
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;
                const dateCell = document.createElement('td');
                dateCell.textContent = user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'N/A';

                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(dateCell);

                userListContainer.appendChild(row);
            });
        }
    }

    function handleProfileUpdate(event) {
        event.preventDefault();
        const email = currentUser.email;
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
        updateDoc(doc(db, "users", currentUser.uid), profile)
            .then(() => {
                alert('Perfil actualizado con éxito');
                updateProfileIcon();
            })
            .catch((error) => {
                console.error("Error al actualizar perfil:", error);
                alert('No se pudo actualizar el perfil.');
            });
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
        hideAllScreens();
        const homeScreen = document.getElementById('home-screen');
        if (homeScreen) homeScreen.style.display = 'block';
        const userNameHome = document.getElementById('user-name-home');
        if (userNameHome && currentUser) userNameHome.textContent = currentUser.email;
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        if (header) header.style.display = 'flex';
        if (footer) footer.style.display = 'block';
        const menu = document.getElementById('menu-desplegable');
        if (menu) menu.style.display = 'flex';
        updateProfileIcon();
    }

    function hideAllScreens() {
        const screens = document.querySelectorAll('.card');
        screens.forEach(screen => screen.style.display = 'none');
    }

    function updateProfileIcon() {
        const profileIcon = document.getElementById('profile-icon');
        if (profileIcon) {
            profileIcon.src = 'assets/default-profile.png'; // Aquí podrías actualizar con la imagen de perfil real si está almacenada
        }
    }
})();

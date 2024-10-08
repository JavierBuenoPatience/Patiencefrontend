(function() {
    // Encapsulamos el código en una función autoejecutable para evitar variables globales

    // Importar las funcionalidades de Firebase
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDpCwvvgd047aMQj3wvnGZRULklq04OqKM",
        authDomain: "patience-b1063.firebaseapp.com",
        projectId: "patience-b1063",
        storageBucket: "patience-b1063.appspot.com",
        messagingSenderId: "733466730686",
        appId: "1:733466730686:web:de1e1f8fa8783491ecbeef",
        measurementId: "G-TD50WYPDTC"
    };

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore();

    let currentUser = null;

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

        // Manejo del estado de sesión
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) {
                    // Si es un nuevo usuario, crear un documento en Firestore
                    await setDoc(doc(db, "users", user.uid), {
                        email: user.email,
                        name: "",
                        profileImage: "assets/default-profile.png",
                        documents: [],
                        folders: [],
                        registeredAt: new Date().toISOString()
                    });
                }
                showHomeScreen();
                if (menu) menu.style.display = 'flex';
            } else {
                currentUser = null;
                showLoginScreen();
                if (menu) menu.style.display = 'none';
            }
        });

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

        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
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
            .then((userCredential) => {
                currentUser = userCredential.user;
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

    function showProfile() {
        if (currentUser) {
            hideAllScreens();
            const profileScreen = document.getElementById('profile-screen');
            if (profileScreen) profileScreen.style.display = 'block';
            document.getElementById('profile-email').value = currentUser.email;
        } else {
            showLoginScreen();
        }
    }

    function showIASpecializedOptions() {
        if (currentUser) {
            hideAllScreens();
            const iaSpecializedScreen = document.getElementById('ia-specialized-screen');
            if (iaSpecializedScreen) iaSpecializedScreen.style.display = 'block';
        } else {
            showLoginScreen();
        }
    }

    function hideAllScreens() {
        const screens = document.querySelectorAll('.card');
        screens.forEach(screen => screen.style.display = 'none');
    }

    function updateProfileIcon() {
        const profileIcon = document.getElementById('profile-icon');
        if (profileIcon && currentUser) {
            profileIcon.src = "assets/default-profile.png"; // En el futuro se puede mejorar para cargar la imagen del perfil del usuario desde Firestore
        }
    }
})();

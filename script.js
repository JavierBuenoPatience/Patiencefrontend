(function() {
    // Encapsulamos el código en una función autoejecutable para evitar variables globales

    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
    import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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
    const db = getFirestore(app);

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
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                showHomeScreen();
                if (menu) menu.style.display = 'flex';
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
    });

    async function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            currentUser = userCredential.user;
            showHomeScreen();
            const menu = document.getElementById('menu-desplegable');
            if (menu) menu.style.display = 'flex';
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
            alert('Correo o contraseña incorrectos.');
        }
    }

    async function handleRegister() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            currentUser = userCredential.user;
            await addDoc(collection(db, "users"), {
                uid: currentUser.uid,
                email: currentUser.email,
                registeredAt: new Date().toISOString()
            });
            alert('Registro exitoso, ahora puedes iniciar sesión.');
            showLoginScreen();
        } catch (error) {
            console.error("Error al registrar:", error.message);
            alert('No se pudo completar el registro.');
        }
    }

    async function handleLogout() {
        try {
            await signOut(auth);
            console.log("Usuario deslogueado");
            currentUser = null;
            showLoginScreen();
            const menu = document.getElementById('menu-desplegable');
            if (menu) menu.style.display = 'none';
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
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
        updateDocumentOverview();
    }

    async function showProfile() {
        if (currentUser) {
            hideAllScreens();
            const profileScreen = document.getElementById('profile-screen');
            if (profileScreen) profileScreen.style.display = 'block';

            try {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('profile-email').value = userData.email;
                    document.getElementById('full-name').value = userData.fullName || '';
                    document.getElementById('phone').value = userData.phone || '';
                }
            } catch (error) {
                console.error("Error al obtener los datos del perfil:", error);
            }
        } else {
            showLoginScreen();
        }
    }

    async function updateProfile() {
        if (currentUser) {
            const fullName = document.getElementById('full-name').value;
            const phone = document.getElementById('phone').value;

            try {
                const docRef = doc(db, "users", currentUser.uid);
                await setDoc(docRef, {
                    fullName: fullName,
                    phone: phone
                }, { merge: true });

                alert('Perfil actualizado con éxito');
            } catch (error) {
                console.error("Error al actualizar el perfil:", error);
                alert('No se pudo actualizar el perfil.');
            }
        }
    }

    function hideAllScreens() {
        const screens = document.querySelectorAll('.card');
        screens.forEach(screen => screen.style.display = 'none');
    }

    function updateProfileIcon() {
        const profileIcon = document.getElementById('profile-icon');
        if (profileIcon && currentUser) {
            profileIcon.src = 'assets/default-profile.png'; // Puedes cambiarlo para obtener una imagen personalizada del usuario
        }
    }

    function updateDocumentOverview() {
        // Esta función se puede actualizar para interactuar con Firestore si se quiere almacenar documentos específicos de cada usuario
    }
})();

// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mostrar la pantalla de inicio por defecto
    showHomeScreen();

    // Configurar la acción para actualizar el perfil
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
});

function showHomeScreen() {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('profile-screen').style.display = 'none';
}

function showProfileScreen() {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('profile-screen').style.display = 'block';
}

function handleImageUpload(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('profile-img').src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function handleProfileUpdate(event) {
    event.preventDefault();
    alert('Perfil actualizado con éxito');
}

/* ==========================
   SCRIPT.JS INTEGRADO (COMPLETO Y ACTUALIZADO)
========================== */

// URL del backend desplegado en Render
const BASE_URL = "https://patienceclean.onrender.com";
console.log("Frontend cargado. BASE_URL =", BASE_URL);

// Funciones de comunicación con el backend
async function registerUserAPI(name, email, password) {
    try {
        const resp = await fetch(`${BASE_URL}/users/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        if (!resp.ok) {
            const errorData = await resp.json();
            throw new Error(`Error al registrar: ${resp.status} - ${errorData.detail || errorData.error}`);
        }
        const data = await resp.json();
        console.log("Usuario registrado:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function loginUserAPI(email, password) {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al iniciar sesión: ${response.status} - ${errorData.detail || errorData.error}`);
        }
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Colores y constantes
const COLORS = {
    primary: '#1F3A93',
    secondary: '#22A7F0',
    accent: '#F5F7FA',
    background: '#FFFFFF',
    text: '#2C3E50',
    secondaryText: '#7F8C8D'
};

const discordInviteLink = "https://discord.gg/qGB36SqR";

// Manejo de datos en localStorage
const users = JSON.parse(localStorage.getItem('users')) || {};

// Datos estáticos para academias y especialidades
const academies = [
  { id: 1, name: 'TecnosZubia', city: 'Granada', phone: '958 890 387', email: 'info@tecnoszubia.es',
    specialties: ['Maestros', 'Profesores', 'Administrativos', 'Seguridad', 'SAS'], rating: '4.8/5', image: 'academia-1.jpg' },
  { id: 2, name: 'CEAPRO', city: 'Sevilla', phone: '954 32 00 00', email: 'info@ceapro.es',
    specialties: ['Junta de Andalucía', 'Administración', 'Justicia', 'Educación', 'SAS'], rating: '4.7/5', image: 'academia-2.jpg' },
  { id: 3, name: 'Academia Jesús Ayala', city: 'Málaga', phone: '952 29 00 00', email: 'info@academiajesusayala.com',
    specialties: ['Junta de Andalucía', 'Educación', 'Justicia', 'Seguridad'], rating: '4.6/5', image: 'academia-3.jpg' },
  { id: 4, name: 'Centro Andaluz de Estudios', city: 'Sevilla', phone: '955 11 22 33', email: 'info@centroandaluz.net',
    specialties: ['Seguridad', 'Bomberos', 'Administración de Justicia'], rating: '4.5/5', image: 'academia-4.jpg' },
  { id: 5, name: 'Academia AM', city: 'Sevilla', phone: '954 21 43 21', email: 'info@academiaam.es',
    specialties: ['Junta de Andalucía', 'Estado', 'Justicia', 'Educación'], rating: '4.4/5', image: 'academia-5.jpg' },
  { id: 6, name: 'Academia Foro', city: 'Sevilla', phone: '954 22 33 44', email: 'info@academiaforo.es',
    specialties: ['Junta de Andalucía', 'Estado', 'SAS'], rating: '4.3/5', image: 'academia-6.jpg' },
  { id: 7, name: 'Adriano Preparador', city: 'Sevilla', phone: '954 33 44 55', email: 'info@adrianopreparador.es',
    specialties: ['Junta de Andalucía (cuerpos administrativos y técnicos)'], rating: '4.2/5', image: 'academia-7.jpg' },
  { id: 8, name: 'Academia Opositas', city: 'Córdoba', phone: '957 76 54 32', email: 'info@opositas.com',
    specialties: ['Justicia', 'Hacienda', 'Informática', 'Junta de Andalucía'], rating: '4.1/5', image: 'academia-8.jpg' },
  { id: 9, name: 'MasterD Sevilla', city: 'Sevilla', phone: '954 28 42 12', email: 'info@masterd.es',
    specialties: ['Auxiliar Administrativo', 'Guardia Civil', 'Celador', 'Auxiliar de Enfermería', 'Correos'], rating: '4.0/5', image: 'academia-9.jpg' },
  { id: 10, name: 'Academia de Enseñanza Méndez Núñez', city: 'Sevilla', phone: '954 22 52 25', email: 'info@academiamn.com',
    specialties: ['Junta de Andalucía', 'Educación (Infantil, Primaria, Secundaria)'], rating: '4.0/5', image: 'academia-10.jpg' },
  { id: 11, name: 'Academia Cartuja', city: 'Sevilla', phone: '954 33 22 11', email: 'info@academiacartuja.com',
    specialties: ['Magisterio', 'Justicia', 'Biblioteca', 'Celador', 'Correos'], rating: '3.9/5', image: 'academia-11.jpg' },
  { id: 12, name: 'Academia Progressus', city: 'Sevilla', phone: '954 44 55 66', email: 'info@academiaprogressus.com',
    specialties: ['Policía Nacional', 'Guardia Civil', 'Penitenciarias'], rating: '3.8/5', image: 'academia-12.jpg' },
  { id: 13, name: 'Academia Palmapol', city: 'Sevilla', phone: '954 55 66 77', email: 'info@academiapalmapol.com',
    specialties: ['Policía Nacional', 'Guardia Civil', 'Policía Local', 'Bomberos'], rating: '3.7/5', image: 'academia-13.jpg' },
  { id: 14, name: 'Academia CARE Formación', city: 'Sevilla', phone: '954 66 77 88', email: 'info@careformacion.com',
    specialties: ['Educación', 'Sanidad', 'Administración', 'Justicia'], rating: '3.6/5', image: 'academia-14.jpg' },
  { id: 15, name: 'Academia Innova', city: 'Sevilla', phone: '954 77 88 99', email: 'info@academiainnova.com',
    specialties: ['Estado', 'Andalucía', 'Justicia', 'Correos'], rating: '3.5/5', image: 'academia-15.jpg' },
  { id: 16, name: 'Academia Claustro', city: 'Sevilla', phone: '954 00 11 22', email: 'info@academiaclaustro.com',
    specialties: ['Educación', 'Administración', 'Justicia'], rating: '3.4/5', image: 'academia-16.jpg' },
];

const specialties = [
  { name: 'Biología y Geología', image: 'bio-geologia.jpg', url: 'https://chatgpt.com/g/g-xgl7diXqb-patience-biologia-y-geologia' },
  { name: 'Inglés como Segunda Lengua', image: 'ingles.jpg', url: 'https://chatgpt.com/g/g-mBJ4r4s53-patience-ingles' },
  { name: 'Matemáticas', image: 'matematicas.jpg', url: 'https://chatgpt.com/g/g-67535b2f2b308191a87e2d15a89d6513-patience-matematicas' },
  { name: 'Geografía e Historia', image: 'geografia-historia.jpg', url: 'https://chatgpt.com/g/g-67535eb0d2688191b60c3ee2be32f29e-patience-geografia-e-historia' },
  { name: 'Francés como Lengua Extranjera', image: 'frances.jpg', url: 'https://chatgpt.com/g/g-67535fd05bdc8191856a432c21df2968-patience-frances' }
];

const dailyQuizQuestions = [
  { question: "¿Cuál es la capital de Francia?", options: ["París", "Londres", "Berlín"], answer: 0 },
  { question: "¿Cuál es el resultado de 5x5?", options: ["20", "25", "30"], answer: 1 },
  { question: "¿La célula es la unidad...?", options: ["De heredabilidad", "De estructura y función de los seres vivos", "De la fotosíntesis"], answer: 1 },
  { question: "¿Cuál es el río más largo del mundo?", options: ["Nilo", "Amazonas", "Yangtsé"], answer: 1 },
  { question: "¿Quién escribió 'Don Quijote de la Mancha'?", options: ["Miguel de Cervantes", "Federico García Lorca", "Gabriel García Márquez"], answer: 0 }
];

let currentQuizIndex = -1;
const motivationalMessages = [
  "¡Ánimo! Ya estás un poco más cerca de la meta.",
  "Lo estás haciendo genial, ¡sigue así!",
  "Un poco más y nos tomamos un descanso, ¡ánimo!"
];
let motivationalMessageIndex = 0;
let dailyStreak = 0;
let timerInterval;
let elapsedTime = 0;
let isTimerRunning = false;
let documentsViewMode = 'list';

// -------------------------
// Funciones globales requeridas
// -------------------------
function hideAllMainSections() {
  const sections = [
    'progress-main-screen',
    'study-main-screen',
    'communities-main-screen',
    'news-help-screen',
    'account-screen'
  ];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function hideLoginAndRegistrationScreens() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('registration-screen').style.display = 'none';
}

function showAccountScreen() {
  hideAllMainSections();
  document.getElementById('account-screen').style.display = 'block';
}

// -------------------------
// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded: iniciando aplicación");
  if (localStorage.getItem('loggedIn') === 'true') {
    hideLoginAndRegistrationScreens();
    showProgressMainScreen();
  } else {
    showLoginScreen();
  }

  const uploadInput = document.getElementById('upload-document');
  if (uploadInput) {
    uploadInput.addEventListener('change', uploadDocuments);
  }

  const documentSearch = document.getElementById('document-search');
  if (documentSearch) {
    documentSearch.addEventListener('input', filterDocuments);
  }

  initAcademyDirectory();
  initSpecialties();
  updateNotifications();

  document.addEventListener('click', (event) => {
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationPanel = document.getElementById('notification-panel');
    if (notificationIcon && notificationPanel &&
        !notificationIcon.contains(event.target) &&
        !notificationPanel.contains(event.target)) {
      notificationPanel.classList.remove('show-notifications');
    }
  });

  loadSidebarState();
  updateMotivationalMessage();
  setInterval(updateMotivationalMessage, 5 * 60 * 1000);

  loadDailyStreak();
  loadDailyCheckInStatus();
  loadRecentActivity();
  updateRecentActivitySummary();
});

// -------------------------
// Funciones de registro y login con backend
// -------------------------
async function handleRegistration(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  try {
    const newUser = await registerUserAPI(name, email, password);
    console.log("Registro exitoso:", newUser);
    document.getElementById('registration-form').reset();
    document.getElementById('registration-message').style.display = 'block';
    document.getElementById('welcome-button').style.display = 'block';
  } catch (error) {
    alert(error.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    const loginResp = await loginUserAPI(email, password);
    console.log("Login exitoso:", loginResp);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('email', email);
    localStorage.setItem('name', loginResp.user.name || "");
    hideLoginAndRegistrationScreens();
    document.querySelector('header').style.display = 'flex';
    document.querySelector('footer').style.display = 'block';
    document.getElementById('sidebar').style.display = 'block';
    showProgressMainScreen();
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
}

function handleLogout() {
  if (isTimerRunning) {
    pauseTimer();
    saveStudySession();
  }
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  hideAllMainSections();
  showLoginScreen();
}

function showLoginScreen() {
  hideAllMainSections();
  document.getElementById('login-screen').style.display = 'block';
  document.getElementById('registration-screen').style.display = 'none';
  document.querySelector('header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
  document.getElementById('sidebar').style.display = 'none';
}

function showRegistrationScreen() {
  hideAllMainSections();
  document.getElementById('registration-screen').style.display = 'block';
  document.getElementById('login-screen').style.display = 'none';
  document.querySelector('header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';
  document.getElementById('sidebar').style.display = 'none';
}

function showProgressMainScreen() {
  hideAllMainSections();
  document.getElementById('progress-main-screen').style.display = 'block';
  document.getElementById('sidebar').style.display = 'block';
}

// -------------------------
// Funciones de perfil
function handleProfileUpdate(event) {
  event.preventDefault();
  const email = localStorage.getItem('email');
  const user = users[email];
  if (!user) {
    alert("No se encuentra usuario en localStorage.");
    return;
  }
  const profile = {
    fullName: document.getElementById('full-name').value,
    phone: document.getElementById('phone').value,
    examDate: document.getElementById('exam-date').value,
    specialty: document.getElementById('specialty').value,
    hobbies: document.getElementById('hobbies').value,
    location: document.getElementById('location').value,
    profileImage: document.getElementById('profile-img').src
  };
  user.profile = profile;
  user.examDate = profile.examDate;
  user.name = profile.fullName || user.name;
  localStorage.setItem('users', JSON.stringify(users));
  alert('Perfil actualizado.');
  updateProfileIcon();
  updateUserNameHome();
  updateDashboard();
}

function updateUserNameHome() {
  const email = localStorage.getItem('email');
  const user = users[email];
  if (user && user.profile && user.profile.fullName) {
    document.getElementById('user-name-home').textContent = user.profile.fullName;
  } else {
    document.getElementById('user-name-home').textContent = user?.name || 'Opositor';
  }
}

function updateProfileIcon() {
  const profileIcon = document.getElementById('profile-icon');
  const email = localStorage.getItem('email');
  const profile = users[email]?.profile || {};
  if (profileIcon) {
    profileIcon.src = profile.profileImage || 'assets/default-profile.png';
  }
}

function handleImageUpload(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('profile-img').src = e.target.result;
  };
  if (event.target.files && event.target.files[0]) {
    reader.readAsDataURL(event.target.files[0]);
  }
}

// -------------------------
// Funciones de actividad
function loadRecentActivity() {}
function updateRecentActivitySummary() {
  const email = localStorage.getItem('email');
  const user = users[email];
  const recentActivitySummary = document.getElementById('recent-activity-summary');
  if (recentActivitySummary) {
    if (user?.recentActivities?.length > 0) {
      const lastActivity = user.recentActivities[user.recentActivities.length - 1];
      recentActivitySummary.textContent = `Última actividad: ${lastActivity}`;
    } else {
      recentActivitySummary.textContent = 'Última actividad: --';
    }
  }
}
function displayFullActivity() {
  const email = localStorage.getItem('email');
  const user = users[email];
  const fullActivityList = document.getElementById('full-activity-list');
  if (!fullActivityList) return;
  fullActivityList.innerHTML = '';
  if (!user?.recentActivities?.length) {
    fullActivityList.textContent = 'No hay actividades registradas.';
  } else {
    user.recentActivities.slice().reverse().forEach(act => {
      const li = document.createElement('li');
      li.textContent = act;
      fullActivityList.appendChild(li);
    });
  }
}
function addActivity(message) {
  const email = localStorage.getItem('email');
  const user = users[email];
  if (!user.recentActivities) {
    user.recentActivities = [];
  }
  const now = new Date();
  const timestamp = now.toLocaleString();
  user.recentActivities.push(`[${timestamp}] ${message}`);
  localStorage.setItem('users', JSON.stringify(users));
  updateRecentActivitySummary();
}

// -------------------------
// Funciones de Onboarding
function startOnboarding() {
  showOverlay();
  showOnboardingStep(1);
}
function nextOnboardingStep() {
  const currentStep = parseInt(localStorage.getItem('onboardingStep')) || 1;
  const nextStep = currentStep + 1;
  showOnboardingStep(nextStep);
}
function showOnboardingStep(step) {
  const totalSteps = 5;
  for (let i = 1; i <= totalSteps; i++) {
    const stepElement = document.getElementById(`onboarding-step-${i}`);
    if (stepElement) {
      stepElement.style.display = i === step ? 'block' : 'none';
    }
  }
  localStorage.setItem('onboardingStep', step);
}
function finishOnboarding() {
  hideOverlay();
  const email = localStorage.getItem('email');
  if (users[email]) {
    users[email].onboardingCompleted = true;
    localStorage.setItem('users', JSON.stringify(users));
  }
  localStorage.removeItem('onboardingStep');
}
function showOverlay() {
  const overlay = document.getElementById('onboarding-overlay');
  overlay.style.display = 'flex';
}
function hideOverlay() {
  const overlay = document.getElementById('onboarding-overlay');
  overlay.style.display = 'none';
}

// -------------------------
// Funciones del Dashboard y Racha
function updateDashboard() {
  const email = localStorage.getItem('email');
  const user = users[email];
  const daysRemainingElement = document.getElementById('days-remaining');
  const studyHoursElement = document.getElementById('study-hours');
  updateUserNameHome();
  if (user?.examDate) {
    const examDate = new Date(user.examDate);
    const today = new Date();
    const timeDiff = examDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    daysRemainingElement.textContent = daysRemaining > 0 ? daysRemaining + ' días' : 'Examen pasado';
  } else {
    daysRemainingElement.textContent = '--';
  }
  const totalStudyTime = calculateTotalStudyTime(email);
  studyHoursElement.textContent = totalStudyTime ? totalStudyTime + ' horas' : '--';
  updateMotivationalMessage();
  updateRecentActivitySummary();
}
function calculateTotalStudyTime(email) {
  const user = users[email];
  if (user?.studySessions?.length) {
    const totalMilliseconds = user.studySessions.reduce((acc, session) => acc + session.duration, 0);
    const totalHours = (totalMilliseconds / (1000 * 60 * 60)).toFixed(2);
    return totalHours;
  }
  return 0;
}
function updateMotivationalMessage() {
  const messageElement = document.getElementById('motivational-message');
  if (messageElement) {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    messageElement.textContent = randomMessage;
  }
}
function handleLogoClick() {
  if (localStorage.getItem('loggedIn') === 'true') {
    showProgressMainScreen();
  } else {
    showLoginScreen();
  }
}
function loadDailyStreak() {
  const email = localStorage.getItem('email');
  const user = users[email];
  if (!user.dailyStreak) {
    user.dailyStreak = 0;
    user.lastCheckinDate = null;
    localStorage.setItem('users', JSON.stringify(users));
  }
  dailyStreak = user.dailyStreak;
}
function updateDailyStreakDisplay() {
  const dailyStreakElement = document.getElementById('daily-streak');
  if (dailyStreakElement) {
    dailyStreakElement.textContent = dailyStreak + " días";
  }
}
function handleDailyCheckIn() {
  const email = localStorage.getItem('email');
  const user = users[email];
  const today = new Date().toDateString();
  const lastCheckin = user.lastCheckinDate ? new Date(user.lastCheckinDate).toDateString() : null;
  if (!lastCheckin) {
    user.dailyStreak = 1;
    user.lastCheckinDate = new Date();
    dailyStreak = 1;
    addNotification("Has hecho check-in por primera vez. ¡Racha iniciada!");
    addActivity("Check-in diario realizado");
  } else {
    const diff = (new Date(today) - new Date(lastCheckin)) / (1000 * 60 * 60 * 24);
    if (diff === 0) {
      document.getElementById('checkin-status').textContent = "Ya hiciste check-in hoy.";
      return;
    } else if (diff === 1) {
      user.dailyStreak++;
      user.lastCheckinDate = new Date();
      dailyStreak = user.dailyStreak;
      addNotification(`Racha incrementada a ${dailyStreak} días.`);
      addActivity("Check-in diario incrementa racha a " + dailyStreak);
    } else {
      user.dailyStreak = 1;
      user.lastCheckinDate = new Date();
      dailyStreak = 1;
      addNotification("La racha se ha reiniciado. ¡Vuelve a empezar con fuerza!");
      addActivity("Check-in diario, racha reiniciada");
    }
  }
  localStorage.setItem('users', JSON.stringify(users));
  updateDailyStreakDisplay();
  document.getElementById('checkin-status').textContent = "Check-in completado hoy!";
  updateRecentActivitySummary();
}

// -------------------------
// Funciones del Cronómetro
function startTimer() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    const startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateTimerDisplay();
    }, 1000);
  }
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  const resetBtn = document.getElementById('reset-timer');
  if (startBtn && pauseBtn && resetBtn) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  }
}
function pauseTimer() {
  if (!isTimerRunning) return;
  isTimerRunning = false;
  clearInterval(timerInterval);
  saveStudySession();
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  if (startBtn && pauseBtn) {
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
}
function resetTimer() {
  if (isTimerRunning) {
    pauseTimer();
  }
  elapsedTime = 0;
  updateTimerDisplay();
  const resetBtn = document.getElementById('reset-timer');
  if (resetBtn) {
    resetBtn.disabled = true;
  }
}
function updateTimerDisplay() {
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60)).toString().padStart(2, '0');
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60).toString().padStart(2, '0');
  const seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');
  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }
}
function saveStudySession() {
  const email = localStorage.getItem('email');
  const user = users[email];
  if (!user.studySessions) {
    user.studySessions = [];
  }
  user.studySessions.push({
    duration: elapsedTime,
    date: new Date()
  });
  localStorage.setItem('users', JSON.stringify(users));
  updateDashboard();
  elapsedTime = 0;
  updateTimerDisplay();
  addActivity("Sesión de estudio guardada.");
  updateRecentActivitySummary();
}

// -------------------------
// Funciones del Quiz Diario
function openQuizModal() {
  const quizModal = document.getElementById('quiz-modal');
  quizModal.style.display = 'block';
  loadDailyQuiz();
}
function closeQuizModal() {
  const quizModal = document.getElementById('quiz-modal');
  quizModal.style.display = 'none';
}
window.onclick = function(event) {
  const quizModal = document.getElementById('quiz-modal');
  if (event.target === quizModal) {
    quizModal.style.display = 'none';
  }
};
function loadDailyQuiz() {
  currentQuizIndex = (currentQuizIndex + 1) % dailyQuizQuestions.length;
  const questionObj = dailyQuizQuestions[currentQuizIndex];
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizResult = document.getElementById('quiz-result');
  quizQuestion.textContent = questionObj.question;
  quizOptions.innerHTML = '';
  quizResult.textContent = '';
  questionObj.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => checkDailyQuizAnswer(idx);
    quizOptions.appendChild(btn);
  });
}
function checkDailyQuizAnswer(selectedIndex) {
  const questionObj = dailyQuizQuestions[currentQuizIndex];
  const quizResult = document.getElementById('quiz-result');
  if (selectedIndex === questionObj.answer) {
    quizResult.textContent = "¡Correcto!";
    addActivity(`Quiz Diario: Respuesta correcta a "${questionObj.question}"`);
    addNotification("Has respondido correctamente al Quiz Diario.");
  } else {
    quizResult.textContent = "Respuesta incorrecta.";
    addActivity(`Quiz Diario: Respuesta incorrecta a "${questionObj.question}"`);
    addNotification("Has respondido incorrectamente al Quiz Diario.");
  }
  updateRecentActivitySummary();
}

// -------------------------
// Funciones para Discord (Grupos)
function redirectToDiscord() {
  window.open(discordInviteLink, '_blank');
}

// -------------------------
// Funciones para IA Especializada
function initSpecialties() {
  const aiCardsContainer = document.getElementById('ai-cards-container');
  if (!aiCardsContainer) return;
  aiCardsContainer.innerHTML = '';
  specialties.forEach(specialty => {
    const aiCard = document.createElement('div');
    aiCard.classList.add('ai-card');
    aiCard.onclick = () => {
      if (specialty.url !== '#') {
        window.open(specialty.url, '_blank');
      } else {
        alert('Enlace próximamente disponible.');
      }
    };
    aiCard.innerHTML = `
      <img src="assets/${specialty.image}" alt="${specialty.name}">
      <h3>${specialty.name}</h3>
    `;
    aiCardsContainer.appendChild(aiCard);
  });
}
function filterSpecialties() {
  const searchTerm = (document.getElementById('ai-search-input')?.value.toLowerCase() || '');
  const aiCardsContainer = document.getElementById('ai-cards-container');
  if (!aiCardsContainer) return;
  aiCardsContainer.innerHTML = '';
  if (!searchTerm) {
    specialties.forEach(specialty => {
      const aiCard = document.createElement('div');
      aiCard.classList.add('ai-card');
      aiCard.onclick = () => {
        if (specialty.url !== '#') {
          window.open(specialty.url, '_blank');
        } else {
          alert('Enlace próximamente disponible.');
        }
      };
      aiCard.innerHTML = `
        <img src="assets/${specialty.image}" alt="${specialty.name}">
        <h3>${specialty.name}</h3>
      `;
      aiCardsContainer.appendChild(aiCard);
    });
    return;
  }
  const filtered = specialties.filter(s => s.name.toLowerCase().includes(searchTerm));
  filtered.forEach(specialty => {
    const aiCard = document.createElement('div');
    aiCard.classList.add('ai-card');
    aiCard.onclick = () => {
      if (specialty.url !== '#') {
        window.open(specialty.url, '_blank');
      } else {
        alert('Enlace próximamente disponible.');
      }
    };
    aiCard.innerHTML = `
      <img src="assets/${specialty.image}" alt="${specialty.name}">
      <h3>${specialty.name}</h3>
    `;
    aiCardsContainer.appendChild(aiCard);
  });
}

// -------------------------
// Funciones para Directorio de Academias
function initAcademyDirectory() {
  populateFilters();
  renderAcademies();
}
function populateFilters() {
  const cityFilter = document.getElementById('city-filter');
  const specialtyFilter = document.getElementById('specialty-filter');
  if (!cityFilter || !specialtyFilter) return;
  const cities = [...new Set(academies.map(a => a.city))].sort();
  const specialtiesList = [...new Set(academies.flatMap(a => a.specialties))].sort();
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });
  specialtiesList.forEach(spec => {
    const option = document.createElement('option');
    option.value = spec;
    option.textContent = spec;
    specialtyFilter.appendChild(option);
  });
}
function filterAcademies() {
  const city = document.getElementById('city-filter')?.value;
  const specialty = document.getElementById('specialty-filter')?.value;
  let filteredAcademies = academies;
  if (city) {
    filteredAcademies = filteredAcademies.filter(a => a.city === city);
  }
  if (specialty) {
    filteredAcademies = filteredAcademies.filter(a => a.specialties.includes(specialty));
  }
  renderAcademies(filteredAcademies);
}
function renderAcademies(academyList = academies) {
  const academyContainer = document.getElementById('academy-container');
  if (!academyContainer) return;
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
    rating.textContent = '★ ' + academy.rating;
    header.appendChild(name);
    header.appendChild(rating);
    const image = document.createElement('img');
    image.src = `assets/${academy.image || 'academia-default.jpg'}`;
    image.alt = academy.name;
    image.classList.add('academy-image');
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
    academyCard.appendChild(image);
    academyCard.appendChild(info);
    academyCard.appendChild(annotationSection);
    academyContainer.appendChild(academyCard);
  });
}
function getUserAnnotation(academyName) {
  const email = localStorage.getItem('email');
  if (users[email] && users[email].annotations && users[email].annotations[academyName]) {
    return users[email].annotations[academyName];
  }
  return '';
}
function saveUserAnnotation(academyName, annotation) {
  const email = localStorage.getItem('email');
  if (!users[email].annotations) {
    users[email].annotations = {};
  }
  users[email].annotations[academyName] = annotation;
  localStorage.setItem('users', JSON.stringify(users));
  addNotification(`Anotación añadida para la academia "${academyName}".`);
  addActivity(`Anotación añadida para la academia "${academyName}".`);
  updateRecentActivitySummary();
}

// -------------------------
// Funciones para Noticias
function showNewsContent(newsType) {
  const csifIframe = document.getElementById('csif-iframe');
  const sipriIframe = document.getElementById('sipri-iframe');
  if (!csifIframe || !sipriIframe) return;
  csifIframe.style.display = 'none';
  sipriIframe.style.display = 'none';
  if (newsType === 'csif') {
    csifIframe.style.display = 'block';
  } else if (newsType === 'sipri') {
    sipriIframe.style.display = 'block';
  }
}

// -------------------------
// Funciones para Documentos
function uploadDocuments(event) {
  const email = localStorage.getItem('email');
  const files = event.target.files;
  if (!users[email].documents) {
    users[email].documents = [];
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = function(e) {
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
      addNotification(`Documento "${file.name}" subido correctamente.`);
      addActivity(`Documento "${file.name}" subido.`);
      updateRecentActivitySummary();
    };
    reader.readAsDataURL(file);
  }
}
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
    addNotification(`Carpeta "${folderName}" creada exitosamente.`);
    addActivity(`Carpeta "${folderName}" creada.`);
    updateRecentActivitySummary();
  }
}
function deleteFolder(folderName) {
  const email = localStorage.getItem('email');
  const folderIndex = users[email].folders.findIndex(folder => folder.name === folderName);
  if (folderIndex > -1) {
    users[email].folders.splice(folderIndex, 1);
    localStorage.setItem('users', JSON.stringify(users));
    displayDocuments();
    addNotification(`Carpeta "${folderName}" eliminada.`);
    addActivity(`Carpeta "${folderName}" eliminada.`);
    updateRecentActivitySummary();
  }
}
function displayDocuments() {
  const email = localStorage.getItem('email');
  const documentsContainer = document.getElementById('documents-container');
  if (!documentsContainer) return;
  documentsContainer.innerHTML = '';
  if (documentsViewMode === 'list') {
    documentsContainer.classList.add('list-view');
    documentsContainer.classList.remove('grid-view');
  } else {
    documentsContainer.classList.add('grid-view');
    documentsContainer.classList.remove('list-view');
  }
  const userFolders = users[email].folders || [];
  userFolders.forEach(folder => {
    const folderElement = document.createElement('div');
    folderElement.classList.add('folder-card');
    const folderHeader = document.createElement('div');
    folderHeader.classList.add('folder-header');
    folderHeader.textContent = folder.name;
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = (e) => {
      e.stopPropagation();
      deleteFolder(folder.name);
    };
    folderHeader.appendChild(deleteButton);
    folderElement.appendChild(folderHeader);
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
function openDocument(email, doc) {
  doc.lastOpened = new Date();
  users[email].lastDocument = doc.name;
  localStorage.setItem('users', JSON.stringify(users));
  const byteCharacters = atob(doc.fileContent.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: doc.fileType });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
  addActivity(`Documento "${doc.name}" abierto.`);
  updateRecentActivitySummary();
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
        addNotification(`Documento "${documentName}" movido a "${selectedFolder}".`);
        addActivity(`Documento "${documentName}" movido a "${selectedFolder}".`);
        updateRecentActivitySummary();
      } else {
        alert('Documento no encontrado.');
      }
    } else {
      alert('Carpeta no encontrada.');
    }
  }
}
function filterDocuments() {
  const searchTerm = (document.getElementById('document-search')?.value || '').toLowerCase();
  const email = localStorage.getItem('email');
  const documentsContainer = document.getElementById('documents-container');
  if (!documentsContainer) return;
  documentsContainer.innerHTML = '';
  if (documentsViewMode === 'list') {
    documentsContainer.classList.add('list-view');
    documentsContainer.classList.remove('grid-view');
  } else {
    documentsContainer.classList.add('grid-view');
    documentsContainer.classList.remove('list-view');
  }
  const userDocuments = users[email].documents || [];
  const filteredDocuments = userDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm)
  );
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
function toggleDocumentsView() {
  documentsViewMode = (documentsViewMode === 'list') ? 'grid' : 'list';
  displayDocuments();
}

// -------------------------
// Funciones para Sidebar y Notificaciones
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show-sidebar');
}
function togglePinSidebar() {
  const pinButton = document.getElementById('pin-sidebar');
  const sidebar = document.getElementById('sidebar');
  const isPinned = localStorage.getItem('sidebarPinned') === 'true';
  if (isPinned) {
    localStorage.setItem('sidebarPinned', 'false');
    pinButton.classList.remove('pinned');
    sidebar.classList.remove('pinned');
  } else {
    localStorage.setItem('sidebarPinned', 'true');
    pinButton.classList.add('pinned');
    sidebar.classList.add('pinned');
    sidebar.classList.add('show-sidebar');
  }
}
function loadSidebarState() {
  const pinButton = document.getElementById('pin-sidebar');
  const sidebar = document.getElementById('sidebar');
  const isPinned = localStorage.getItem('sidebarPinned') === 'true';
  if (isPinned) {
    pinButton.classList.add('pinned');
    sidebar.classList.add('pinned');
    sidebar.classList.add('show-sidebar');
  } else {
    pinButton.classList.remove('pinned');
    sidebar.classList.remove('pinned');
  }
}
function toggleNotifications() {
  const notificationPanel = document.getElementById('notification-panel');
  notificationPanel.classList.toggle('show-notifications');
}
function updateNotifications() {
  const notificationCount = document.getElementById('notification-count');
  const notificationList = document.getElementById('notification-list');
  const email = localStorage.getItem('email');
  const user = users[email];
  const notifications = user?.notifications || [];
  notificationCount.textContent = notifications.length;
  notificationList.innerHTML = '';
  if (notifications.length === 0) {
    const noNotifications = document.createElement('li');
    noNotifications.textContent = 'No tienes notificaciones nuevas.';
    notificationList.appendChild(noNotifications);
  } else {
    notifications.forEach(notification => {
      const notificationItem = document.createElement('li');
      notificationItem.textContent = notification;
      notificationList.appendChild(notificationItem);
    });
  }
}
function addNotification(message) {
  const email = localStorage.getItem('email');
  const user = users[email];
  if (!user.notifications) {
    user.notifications = [];
  }
  user.notifications.push(message);
  localStorage.setItem('users', JSON.stringify(users));
  addActivity("Notificación: " + message);
}

// -------------------------
// Fin de Script

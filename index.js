// index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Configuration, OpenAIApi } = require('openai');

// Inicializar Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: functions.config().openai.key, // Asegúrate de configurar esta variable
});
const openai = new OpenAIApi(configuration);

/**
 * Función: chatWithGPT
 * Descripción: Maneja la interacción con la IA de OpenAI, gestionando el historial de chat y respondiendo según la especialidad seleccionada.
 */
exports.chatWithGPT = functions.https.onCall(async (data, context) => {
  // Verificar que el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
  }

  const userId = context.auth.uid;
  const userMessage = data.message;
  const specialty = data.specialty; // Especialidad seleccionada

  // Validar los argumentos
  if (!userMessage || !specialty) {
    throw new functions.https.HttpsError('invalid-argument', 'El mensaje y la especialidad son requeridos.');
  }

  // Obtener el historial de chat del usuario
  const chatHistoryRef = db.collection('users').doc(userId).collection('chats').doc(specialty);
  const chatDoc = await chatHistoryRef.get();
  let chatHistory = [];

  if (chatDoc.exists) {
    chatHistory = chatDoc.data().messages || [];
  }

  // Añadir el mensaje del usuario al historial
  chatHistory.push({ role: 'user', content: userMessage });

  // Limitar el historial a los últimos 20 mensajes para optimizar
  const MAX_MESSAGES = 20;
  if (chatHistory.length > MAX_MESSAGES) {
    chatHistory = chatHistory.slice(chatHistory.length - MAX_MESSAGES);
  }

  // Definir el mensaje de sistema para la especialidad
  let systemMessage = '';
  switch (specialty) {
    case 'biologia':
      systemMessage = 'Eres un experto en Biología y Geología para secundaria.';
      break;
    case 'ingles':
      systemMessage = 'Eres un experto en Inglés para secundaria.';
      break;
    case 'lengua':
      systemMessage = 'Eres un experto en Lengua Castellana y Literatura para secundaria.';
      break;
    case 'matematicas':
      systemMessage = 'Eres un experto en Matemáticas para secundaria.';
      break;
    default:
      systemMessage = 'Eres un asistente útil.';
  }

  // Construir el historial de mensajes para enviar a OpenAI
  const messages = [
    { role: 'system', content: systemMessage },
    ...chatHistory,
  ];

  try {
    // Hacer la solicitud a OpenAI
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // O 'gpt-4' si tienes acceso
      messages: messages,
    });

    const assistantMessage = completion.data.choices[0].message.content;

    // Añadir la respuesta de la IA al historial
    chatHistory.push({ role: 'assistant', content: assistantMessage });

    // Guardar el historial actualizado en Firestore
    await chatHistoryRef.set({ messages: chatHistory });

    // Devolver la respuesta al front-end
    return { reply: assistantMessage };
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error);
    throw new functions.https.HttpsError('internal', 'Error al comunicarse con OpenAI.');
  }
});

/**
 * Función: getChatHistory
 * Descripción: Obtiene el historial de chat para una especialidad específica.
 */
exports.getChatHistory = functions.https.onCall(async (data, context) => {
  // Verificar que el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
  }

  const userId = context.auth.uid;
  const specialty = data.specialty; // Especialidad seleccionada

  // Validar los argumentos
  if (!specialty) {
    throw new functions.https.HttpsError('invalid-argument', 'La especialidad es requerida.');
  }

  // Obtener el historial de chat del usuario
  const chatHistoryRef = db.collection('users').doc(userId).collection('chats').doc(specialty);
  const chatDoc = await chatHistoryRef.get();
  let chatHistory = [];

  if (chatDoc.exists) {
    chatHistory = chatDoc.data().messages || [];
  }

  return { messages: chatHistory };
});

/**
 * Función: createUser
 * Descripción: Crea un nuevo usuario desde el panel de administración utilizando Firebase Admin SDK.
 * Nota: Esta función solo debe ser accesible para usuarios con rol de administrador.
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  // Verificar que el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
  }

  const requesterId = context.auth.uid;

  // Verificar si el usuario que realiza la solicitud es administrador
  const requesterDoc = await db.collection('users').doc(requesterId).get();
  if (!requesterDoc.exists || requesterDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo los administradores pueden crear nuevos usuarios.');
  }

  const newUserEmail = data.email;
  const newUserPassword = data.password;
  const newUserName = data.name;

  // Validar los argumentos
  if (!newUserEmail || !newUserPassword || !newUserName) {
    throw new functions.https.HttpsError('invalid-argument', 'Email, contraseña y nombre son requeridos.');
  }

  try {
    // Crear el usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: newUserEmail,
      password: newUserPassword,
      displayName: newUserName,
      emailVerified: false, // Inicialmente no verificado
    });

    // Asignar rol de 'user' por defecto
    await db.collection('users').doc(userRecord.uid).set({
      email: newUserEmail,
      profile: {
        fullName: newUserName,
        // Puedes añadir otros campos de perfil aquí
      },
      role: 'user',
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      temporaryPassword: false,
    });

    // Enviar correo de verificación
    await admin.auth().generateEmailVerificationLink(newUserEmail);

    return { message: 'Usuario creado exitosamente.' };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw new functions.https.HttpsError('internal', 'No se pudo crear el usuario.');
  }
});

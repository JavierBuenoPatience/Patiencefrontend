const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Configuration, OpenAIApi } = require('openai');

admin.initializeApp();
const db = admin.firestore();

exports.chatWithGPT = functions.https.onCall(async (data, context) => {
  // Verificar que el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
  }

  const userId = context.auth.uid;
  const userMessage = data.message;
  const specialty = data.specialty; // Especialidad seleccionada

  if (!userMessage || !specialty) {
    throw new functions.https.HttpsError('invalid-argument', 'El mensaje y la especialidad son requeridos.');
  }

  // Obtener el historial de chat del usuario
  const chatHistoryRef = db.collection('users').doc(userId).collection('chats').doc(specialty);
  const chatDoc = await chatHistoryRef.get();
  let chatHistory = [];

  if (chatDoc.exists) {
    chatHistory = chatDoc.data().messages;
  }

  // Añadir el mensaje del usuario al historial
  chatHistory.push({ role: 'user', content: userMessage });

  // Configurar OpenAI
  const configuration = new Configuration({
    apiKey: functions.config().openai.key,
  });
  const openai = new OpenAIApi(configuration);

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

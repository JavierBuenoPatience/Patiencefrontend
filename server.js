const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'javibueda@gmail.com', // tu email
    pass: 'tu-contraseña', // tu contraseña
  },
});

function generateConfirmationToken() {
  return crypto.randomBytes(16).toString('hex');
}

function sendConfirmationEmail(email, token) {
  const mailOptions = {
    from: 'javibueda@gmail.com',
    to: email,
    subject: 'Confirma tu cuenta',
    text: `Confirma tu cuenta usando el siguiente enlace: http://tu-dominio.com/confirmar?token=${token}`,
    html: `<strong>Confirma tu cuenta usando el siguiente enlace: <a href="http://tu-dominio.com/confirmar?token=${token}">Confirmar cuenta</a></strong>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Correo de confirmación enviado: ' + info.response);
    }
  });
}

app.post('/send-confirmation-email', (req, res) => {
  const { email, token } = req.body;
  sendConfirmationEmail(email, token);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

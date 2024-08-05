const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'javibueda@gmail.com', // tu email
    pass: 'tu-contraseña', // tu contraseña
  },
});

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

module.exports = sendConfirmationEmail;

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config(); 

    

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587 || 465,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})



const enviarRecuperacionPassword = async (email, link) =>{
    const htmlTemplate =`
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para proceder:</p>
        <a href="${link}" style="display: inline-block; padding: 10px 15px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo electrónico.</p>
        <p>Saludos,<br/>El equipo de Soporte</p>
    </div>
    `;


return transporter.sendMail({
    from: `"Soporte" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Recuperación de Contraseña",
    html: htmlTemplate
});
}

module.exports = { enviarRecuperacionPassword };
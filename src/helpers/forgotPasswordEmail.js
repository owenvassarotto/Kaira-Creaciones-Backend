import nodemailer from "nodemailer";

// Envia email para recuperar contraseña
const forgotPasswordEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    });

    // Enviar email
    const {name, email, token} = data;

    const info = await transport.sendMail({
        // Contenido del email
        from: 'Kaira Creaciones - Inspirando tu estilo, resaltando tu esencia.',
        to: email,
        subject: 'Restablecer contraseña en Kaira Creaciones',
        text: 'Restablecer contraseña en Kaira Creaciones',
        html: `
            <div style="font-family: 'Montserrat', sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
                <h2 style="color: #5c0e34;">¡Restablecer Contraseña en Kaira Creaciones!</h2>
                <p>Hola ${name},</p>
                <p>Recibes este correo porque solicitaste restablecer tu contraseña en Kaira Creaciones. Haz clic en el siguiente enlace para continuar:</p>
                <a href="${process.env.FRONTEND_URL}/forgot-password/${token}" style="color: white; text-decoration: none; font-weight: bold; text-align: center; padding: 15px; background-color: #5c0e34; border-radius: 5px; display: block; width: 100%">Restablecer Contraseña</a>
                <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
                <p>¡Gracias por usar Kaira Creaciones!</p>
            </div>
        `
    });
    

    console.log("Message sent: %s", info.messageId);
}

export default forgotPasswordEmail;
import nodemailer from "nodemailer";

const registerEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    });

    const { name, email, token } = data;

    const info = await transport.sendMail({
        // Contenido del email
        from: 'Kaira Creaciones - Resaltando tu estilo, inspirando tu esencia.',
        to: email,
        subject: 'Confirma tu cuenta para la página de Kaira Creaciones',
        text: 'Confirma tu cuenta para la página de Kaira Creaciones',
        html: `
            <div style="font-family: 'Montserrat', sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
                <h2 style="color: #5c0e34;">¡Bienvenido/a a Kaira Creaciones!</h2>
                <p>Hola ${name},</p>
                <p>Tu cuenta está lista para ser utilizada. Solo debes confirmarla haciendo clic en el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/confirm/${token}" style="color: white; text-decoration: none; font-weight: bold; text-align: center; padding: 15px; background-color: #5c0e34; border-radius: 5px; display: block; with: 100%">Confirmar Cuenta</a>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
                <p>¡Gracias ser parte de la página de Kaira Creaciones!</p>
            </div>
        `
    });

    console.log("Message sent: %s", info.messageId);
}

export default registerEmail;

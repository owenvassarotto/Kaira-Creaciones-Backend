import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post('/contact', async (req, res) => {

    const { name, email, phone_number, message } = req.body;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    });

    try {
        const info = await transport.sendMail({
            from: 'Kaira Creaciones - Resaltando tu estilo, inspirando tu esencia.',
            to: process.env.EMAIL_USER,
            subject: 'Nuevo mensaje de contacto',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); max-width: 600px; margin: 20px auto; color: #333;">
                    <h2 style="color: #5c0e34; font-size: 24px; text-align: center; margin-bottom: 20px;">¡Tienes un nuevo mensaje de contacto!</h2>
                    <div style="background: white; padding: 20px; border-radius: 10px;">
                        <p style="font-weight: bold">Se ha recibido un nuevo mensaje de:</p>
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Teléfono:</strong> ${phone_number}</p>
                        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                            <h3 style="font-size: 20px; color: #5c0e34;">Mensaje:</h3>
                            <p style="line-height: 1.5; font-size: 16px;">${message}</p>
                        </div>
                    </div>
                    <p style="text-align: center; margin-top: 30px; font-size: 16px; color: #999;">Revisa este mensaje y responde a la brevedad para mantener una buena comunicación con nuestros usuarios.</p>
                </div>
            `
        });

        if(info.messageId) return res.status(200).json( { message: 'Mensaje enviado correctamente' } );

    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        return res.status(500).json({ message: 'Error al enviar el mensaje' });
    }
});

export default router;
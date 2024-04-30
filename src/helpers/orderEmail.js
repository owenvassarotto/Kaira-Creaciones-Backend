import nodemailer from "nodemailer";

const newOrderEmail = async (orderData) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    });

    const info = await transport.sendMail({
        from: 'Kaira Creaciones - Resaltando tu estilo, inspirando tu esencia.',
        to: process.env.EMAIL_USER, 
        subject: 'Nueva orden recibida',
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); max-width: 600px; margin: 20px auto; color: #333;">
            <h2 style="color: #5c0e34; font-size: 24px; text-align: center; margin-bottom: 20px;">¡Nueva orden recibida!</h2>
            <div style="background: white; padding: 20px; border-radius: 10px;">
                <p style="font-weight: bold">Se ha recibido una nueva orden de:</p>
                <p><strong>Nombre:</strong> ${orderData.name}</p>
                <p><strong>Email:</strong> ${orderData.email}</p>
                <p><strong>Teléfono:</strong> ${orderData.phone_number}</p>

                <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                    <h3 style="color: #5c0e34;">Productos Ordenados:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                                <th style="padding: 8px; border: 1px solid #ddd;">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderData.products.map(product => `
                                <tr style="background-color: white;">
                                    <td style="padding: 8px; border: 1px solid #ddd;">${product.title}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${product.amount}</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">$${product.price}</td>
                                </tr>
                            `).join('')}
                            <tr style="background-color: #f2f2f2;">
                                <td style="padding: 8px; border: 1px solid #ddd;" colspan="2"><strong>Total</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">$${orderData.total_price}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <p style="text-align: center; margin-top: 30px; font-size: 16px; color: #999;">Revisa la plataforma para más detalles o para procesar la orden.</p>
        </div>
    `
    });

    console.log("Message sent: %s", info.messageId);
}

export default newOrderEmail;

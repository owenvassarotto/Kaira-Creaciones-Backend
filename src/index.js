import express from "express";
import "dotenv/config";
import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import userRoutes from "./routes/users.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import testimonialRoutes from "./routes/testimonials.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.get('/', async (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home</title>
        <link rel="icon" href="https://i.imgur.com/S1Bz8ro.png" />
        <style>
            body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            }
            .container {
            text-align: center;
            }
            h1 {
            color: #333;
            font-size: 3rem;
            margin-bottom: 20px;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>Server running! 🥳</h1>
        </div>
        </body>
        </html>
  `);
});
app.use('/api', productsRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', userRoutes);
app.use('/api', ordersRoutes);
app.use('/api', testimonialRoutes);
app.use('/api', contactRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(process.env.PORT || 3000);
console.log(`Server running on port ${process.env.PORT || 3000}`);
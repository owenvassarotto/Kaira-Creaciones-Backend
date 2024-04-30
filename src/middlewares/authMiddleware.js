import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [result] = await pool.query('SELECT id, name, email, is_admin, phone_number FROM users WHERE email = ?', [decoded.email]);

            req.user = result[0];

            return next();
        } catch (error) {
            const err = new Error("Token no válido");
            return res.status(403).json({ message: err.message });
        }
    }

    if(!token){
        const error = new Error("Token inexistente");
        res.status(403).json({ message: error.message });
    }

    next();
}
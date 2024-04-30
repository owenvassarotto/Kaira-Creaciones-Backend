import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { generateJWT } from "../helpers/generateJWT.js";
import registerEmail from "../helpers/registerUserEmail.js";
import forgotPasswordEmail from "../helpers/forgotPasswordEmail.js";

// function to register a new user
export const registerUser = async (req, res) => {

    const { name, email, password, phoneNumber } = req.body;

    // hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // generate token with uuid4
    const token = uuidv4();

    try {
        // check if user already exists in db
        const [userInfo] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if(userInfo.length > 0) return res.status(409).json({ message: "El usuario ya existe"});

        const [result] = await pool.query('INSERT INTO users (name, email, password, phone_number, token) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, phoneNumber, token]);

        // send email to confirm account
        registerEmail({
            name, 
            email, 
            token 
        });

        if (result.affectedRows > 0) return res.status(200).json( { message: 'Usuario creado correctamente, revisa tu email' } );

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ message: 'Error al registrar usuario' });
    }
}

// function to confirm user
export const confirmUser = async (req, res) => {

    const { token } = req.params;
    
    const [user] = await pool.query('SELECT * FROM users WHERE token = ?', [token]);
    
    if(user.length <= 0) {
        const error = new Error("Token no válido");
        return res.status(404).json({ message: error.message });
    }

    try {
        // set user token to null and is_confirmed to true in the database
        await pool.query('UPDATE users SET is_confirmed = true, token = "" WHERE token = ?', [token]);

        return res.status(200).json({ message: 'Usuario confirmado correctamente' });
    } catch (error) {
        console.error('Hubo un error en la confirmación de la cuenta:', error);
        return res.status(400).json({ message: 'Hubo un error en la confirmación de la cuenta' });
    }
}

// function to login user
export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        // check if users exists
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if(user.length <= 0) {
            const error = new Error("El usuario no existe");
            return res.status(404).json({ message: error.message });
        }

        // check if user is confirmed 
        if(!user[0].is_confirmed){
            const error = new Error("Tu cuenta no ha sido confirmada");
            return res.status(403).json({ message: error.message })
        }

        // authenticate user
        const correctPassword = bcrypt.compareSync(password, user[0].password); // true
        if(!correctPassword) {
            const error = new Error("Contraseña incorrecta");
            return res.status(403).json({ message: error.message })
        }        

        return res.json({ 
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            is_admin: user[0].is_admin,
            phone_number: user[0].phone_number,
            token: generateJWT(user[0].id, user[0].name, user[0].email, user[0].is_admin, user[0].phone_number) 
        })

    } catch (error) {
        console.error('Hubo un error al iniciar sesión: ', error);
        return res.status(400).json({ message: 'Hubo un error al iniciar sesión' });
    }
}

export const getProfile = (req, res) => {
    try {
        return res.json(req.user);
    } catch (error) {
        console.error('Hubo un error obtener el perfil:', error);
        return res.status(400).json({ message: 'Hubo un error obtener el perfil' });
    }
}

export const updateUser = async (req, res) => {
    
    const { id } = req.params;

    const { name, email, phone_number } = req.body;

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if(!user.length > 0){
        const error = new Error('El usuario no existe');
        return res.status(400).json({ message: error.message });
    }

    if(user[0].email !== email) {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const userExists = user.length > 0;
        if(userExists) return res.status(400).json({ message: 'Ya existe un usuario con este email' });
    }

    try {
        const [result] = await pool.query('UPDATE users SET name = ?, email = ?, phone_number = ? WHERE id = ?', [name, email, phone_number, id]);

        if(result.affectedRows > 0){
            const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

            return res.status(200).json({
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                is_admin: user[0].is_admin,
                phone_number: user[0].phone_number
            });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Hubo un error editando al usuario' });
    }
}

export const resetPassword = async (req, res) => {
    
    const { email } = req.body;

    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    const existsUser = user.length > 0;    

    if(!existsUser){
        const error = new Error('El usuario no existe');
        return res.status(400).json({ message: error.message });
    }

    try {
        const newToken = uuidv4();
        await pool.query('UPDATE users SET token = ? WHERE id = ?', [newToken, user[0].id])

        forgotPasswordEmail({
            name: user[0].name, 
            email: user[0].email, 
            token: newToken,
        })

        return res.json({ message: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.error('Hubo un error al restablecer la contraseña:', error);
        return res.status(400).json({ message: 'Hubo un error al restablecer la contraseña' });
    }
}

export const checkToken = async (req, res) => {

    const { token } = req.params;

    const [result] = await pool.query('SELECT * FROM users WHERE token = ?', [token]);

    const validToken = result.length > 0;

    if(!validToken) return res.status(400).json({ message: "Token no válido" });

    res.json({ message: "El usuario existe y el token es válido" });
}

export const setNewPassword = async (req, res) => {
    const { token } = req.params;

    const { password } = req.body;

    const [user] = await pool.query('SELECT * FROM users WHERE token = ?', [token]);
    if(!user.length > 0) return res.status(400).json({ message: "No se encontró ningún usuario asociado a este token" });

    const samePassword = bcrypt.compareSync(password, user[0].password); // true
    if(samePassword) {
        const error = new Error("Tu nueva contraseña debe ser diferente a la anterior");
        return res.status(403).json({message: error.message})
    }     

    try {
        const newPassword = bcrypt.hashSync(password, 10);
        await pool.query('UPDATE users SET token = "", password = ? WHERE id = ?', [newPassword, user[0].id])
        return res.json({ message: "Contraseña modificada correctamente" })
    } catch (error) {
        console.error("Hubo un error al restablecer la contraseña:", error);
        return res.status(400).json({ message: "Hubo un error al restablecer la contraseña" });
    }
}

export const updatePassword = async (req, res) => {
    const { id } = req.user;

    const { actualPassword, newPassword } = req.body;

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const existsUser = user.length > 0;  
    if(!existsUser) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ message: error.message });
    }

    // check if password is correct
    const correctPassword = bcrypt.compareSync(actualPassword, user[0].password); // true
    if(!correctPassword) {
        const error = new Error("Contraseña incorrecta");
        return res.status(403).json({ message: error.message })
    }   

    const samePassword = bcrypt.compareSync(newPassword, user[0].password); // true
    if(samePassword) {
        const error = new Error("Tu nueva contraseña debe ser diferente a la anterior");
        return res.status(403).json({message: error.message})
    }     

    // set new password
    try {
        const newHashedPassword = await bcrypt.hashSync(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, user[0].id])
        return res.json({ message: "Contraseña modificada correctamente" })
    } catch (error) {
        console.error("Hubo un error al modificar la contraseña:", error);
        return res.status(400).json({ message: "Hubo un error al modificar la contraseña" });
    }
}
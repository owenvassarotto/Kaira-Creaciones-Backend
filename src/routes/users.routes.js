import { Router } from "express";
import { confirmUser, login, registerUser, getProfile, resetPassword, setNewPassword, checkToken, updateUser, updatePassword } from "../controllers/users.controller.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// public area
router
    .post('/users/register', registerUser)
    .get('/users/confirm/:token', confirmUser)
    .post('/users/login', login)
    .post('/users/forgot-password', resetPassword)
    
    router.route('/users/forgot-password/:token').get(checkToken).post(setNewPassword)
    
// private area
router
    .get('/users/profile', checkAuth, getProfile)    
    .put('/users/reset-password', checkAuth, updatePassword)
    .put('/users/:id', checkAuth, updateUser)

export default router;
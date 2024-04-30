import { Router } from "express";
import { deleteCategory, getCategories, createCategory, updateCategory } from "../controllers/categories.controller.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/categories', getCategories);
router.post('/categories', checkAuth, createCategory);
router.delete('/categories/:id', checkAuth, deleteCategory); 
router.put('/categories/:id', checkAuth, updateCategory); 

export default router;
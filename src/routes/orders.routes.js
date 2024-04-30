import { Router } from "express";
import { createOrder, getOrders, getOrderDetails, updateOrder, deleteOrder } from "../controllers/orders.controller.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router
    .get('/orders', checkAuth, getOrders)
    .get('/orders/order-details/:id', checkAuth, getOrderDetails)
    .post('/orders/create-order', checkAuth, createOrder)
    .put('/orders/:id', checkAuth, updateOrder)
    .delete('/orders/:id', checkAuth, deleteOrder)

export default router;
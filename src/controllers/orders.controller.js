import { pool } from "../config/db.js";
import newOrderEmail from "../helpers/orderEmail.js";

export const getOrders = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT orders.*, COUNT(order_details.id) AS order_details_count, users.name AS user_name, users.email AS user_email, users.phone_number AS user_phone_number
            FROM orders
            LEFT JOIN order_details ON orders.id = order_details.order_id
            JOIN users ON orders.user_id = users.id
            GROUP BY orders.id
            ORDER BY orders.id DESC;
        `);

        return res.json(result[0]);

    } catch (error) {
        console.error('Error al obtener las ordenes:', error);
        return res.status(400).json({ message: 'Error al obtener las ordenes' });
    }
}

export const createOrder = async (req, res) => {

    const { user_id, products, total_price } = req.body; 
    
    try {
        const [orderResult] = await pool.query('INSERT INTO orders (user_id, total_price) VALUES (?, ?)', [user_id, total_price]);
        const orderId = orderResult.insertId;

        for (const product of products) {
            await pool.query('INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)', [orderId, product.id, product.amount, product.price]);
        }

        const [order] = await pool.query(`
            SELECT orders.*, COUNT(order_details.id) AS order_details_count
            FROM orders
            LEFT JOIN order_details ON orders.id = order_details.order_id
            WHERE orders.id = ?
            GROUP BY orders.id;
        `, [orderId])

        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);

        const { name, email, phone_number } = user[0];

        // send email with order details
        newOrderEmail({ products, total_price, name, email, phone_number });

        return res.status(201).json({ message: 'Orden creada exitosamente', order: order[0] });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        return res.status(500).json({ message: 'Ha ocurrido un error al procesar la orden' });
    }
};


export const getOrderDetails = async (req, res) => {

    const { id } = req.params;

    try {
        const [orderDetails] = await pool.query('SELECT * FROM order_details WHERE order_id = ?', [id]);

        res.json(orderDetails);

    } catch (error) {
        console.error('Error al obtener los detalles de la orden:', error);
        res.status(400).json({ message: 'Error al obtener los detalles de la orden' });
    }
}

export const updateOrder = async (req, res) => {
    
    const { id } = req.params;

    const { payment_status, pickup_status } = req.body;

    if (!payment_status && !pickup_status) {
        return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar' });
    }

    if(payment_status === 'pendiente' && pickup_status !== 'por empaquetar'){
        return res.status(400).json({ message: 'El pago debe estar recibido' });                              
    }

    // dinamic SQL query 
    let sql = 'UPDATE orders SET ';
    const updateParams = [];
    if (payment_status) {
        sql += 'payment_status = ?, ';
        updateParams.push(payment_status);
    }
    if (pickup_status) {
        sql += 'pickup_status = ?, ';
        updateParams.push(pickup_status);
    }
    // delete "," and add WHERE condition
    sql = sql.slice(0, -2) + ' WHERE id = ?';
    updateParams.push(id);

    try {
        const [result] = await pool.query(sql, updateParams);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'La orden no se encontró' });
        }

        const [order] = await pool.query(`
            SELECT orders.*, COUNT(order_details.id) AS order_details_count
            FROM orders
            LEFT JOIN order_details ON orders.id = order_details.order_id
            WHERE orders.id = ?
            GROUP BY orders.id;
        `, [id])

        return res.status(200).json({ message: 'Orden actualizada correctamente', order: order[0] });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la orden' });
    }

}

export const deleteOrder = async (req, res) => {

    const { id } = req.params;

    try {
        // first delete all the data from order_details table relationated with the order
        await pool.query('DELETE FROM order_details WHERE order_id = ?', [id]);

        // then we delete the order from "orders" table
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);

        return res.status(200).json({ message: 'Orden eliminada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar la orden' });
    }
}
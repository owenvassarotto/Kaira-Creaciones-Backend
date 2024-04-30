import { pool } from "../config/db.js";
import { deleteImage } from "../helpers/deleteImageFromUploads.js";
import { uploadImage } from "../helpers/uploadImage.js";

// function to get ALL products
export const getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');

        return res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return res.status(400).json({ message: 'Error al obtener productos' });
    }
}

// function to get an SPECIFIC product by id
export const getProduct = async (req, res) => {

    let { id } = req.params;

    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const [result] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

        if(result.length <= 0) return res.status(404).json({ message: "Producto no encontrado" });

        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        return res.status(400).json({ message: 'Error al obtener producto' });
    }
}

// function to CREATE a new product
export const createProduct = async (req, res) => {

    const {title, description, price, is_new, category_id} = req.body; 

    try {
        // upload image and get the name to save in db
        const uploadResult = uploadImage(req.file, "products");

        if(uploadResult.error) return res.status(400).json({ message: uploadResult.error })

        const [result] = await pool.query('INSERT INTO products (title, description, price, image, is_new, category_id) VALUES (?, ?, ?, ?, ?, ?)', [title, description, price, uploadResult.imageName, is_new, category_id]);    

        return res.status(201).json({ message: 'Producto creado exitosamente', productId: result.insertId });

    } catch (error) {
        console.error('Error al crear el producto:', error);
        return res.status(400).json({ message: 'Error al crear el producto' });
    }
}

// function to UPDATE a product
export const updateProduct = async (req, res) => {

    let { id } = req.params;

    const {title, description, price, category_id, is_new} = req.body;

    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {

        let uploadResult = { imageName: null };

        if(req.file){
            // delete previous image before save a new one  
            const [previousImage] = await pool.query("SELECT image FROM products WHERE id = ?", [id])
    
            await deleteImage(previousImage[0].image, "products");
    
            // upload image and get the name to save in db
            uploadResult = uploadImage(req.file, "products");
    
            if(uploadResult.error) return res.status(400).json({ message: uploadResult.error })
        }

        const [result] = await pool.query('UPDATE products SET title = COALESCE(?, title), description = COALESCE(?, description), price = COALESCE(?, price), image = COALESCE(?, image), category_id = COALESCE(?, category_id), is_new = COALESCE(?, is_new) WHERE id = ?', [title, description, price, uploadResult.imageName, category_id, is_new, id]);

        // check if product exists
        if(result.affectedRows === 0) return res.status(404).json({ message: "No se encontró el producto" });

        return res.status(201).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return res.status(400).json({ message: 'Error al actualizar producto' });
    }
}

// function to DELETE a product
export const deleteProduct = async (req, res) => {
    let { id } = req.params;

    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const [result] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

        if(result.length <= 0) return res.status(404).json({ message: "No se encontró el producto" });

        await pool.query('DELETE FROM products WHERE id = ?', [id]);

        // delete product image from uploads folder
        await deleteImage(result[0].image, "products");

        return res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return res.status(400).json({ message: 'Error al eliminar producto' });
    }
}



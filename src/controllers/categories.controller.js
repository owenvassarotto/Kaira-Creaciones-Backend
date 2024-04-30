import { pool } from "../config/db.js"

// function to get ALL the categories
export const getCategories = async (req, res) => {
    
    try {
        const [categories] = await pool.query('SELECT * FROM categories ORDER BY id ASC');

        return res.status(200).json(categories);
    } catch (error) {
        console.error('Hubo un error al obtener las categorías:', error);
        return res.status(400).json({ message: 'Hubo un error al obtener las categorías' });
    }
}

// function to create a new category
export const createCategory = async (req, res) => {

    const { name } = req.body;

    try {
        const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);

        const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

        return res.status(200).json({ message: "Categoría creada correctamente" , newCategory: newCategory[0] }); 

    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        return res.status(400).json({ message: 'Error al obtener la categoría' });
    }
}

// function to DELETE a category by id
export const deleteCategory = async (req, res) => {
    let { id } = req.params;

    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);

        if(result.affectedRows <= 0) return res.status(404).json({ message: "No se encontró la categoría" })

        return res.status(200).json({message: "Categoría eliminada correctamente"});
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        return res.status(400).json({ message: 'Error al eliminar la categoría' });
    }
}

// function to UPDATE a category by id
export const updateCategory = async (req, res) => {
    
    const { name } = req.body;
    
    let { id } = req.params;

    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        const [result] = await pool.query('UPDATE categories SET name = IFNULL(?, name) WHERE id = ?', [name, id]);    

        // check if category exists
        if(result.affectedRows === 0) return res.status(404).json({ message: "Categoría no encontrada" });

        const [updatedCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);

        return res.status(200).json({ message: "Categoría actualizada correctamente" , updatedCategory: updatedCategory[0] }); 
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        return res.status(400).json({ message: 'Error al actualizar la categoría' });
    }
}

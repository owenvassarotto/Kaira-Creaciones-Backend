import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const deleteImage = async (imageName, dir) => {

    const imagePath = path.join(__dirname, `../../uploads/${dir}/${imageName}`);
    
    try {
        if (fs.existsSync(imagePath)) {
            // delete image from uploads folder
            fs.unlinkSync(imagePath);
        } else {
            return res.status(400).json({ message: 'La imagen no existe' });
        }
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        return res.status(400).json({ message: 'Error al eliminar imagen' });
    }
}

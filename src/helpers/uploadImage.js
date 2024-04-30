import { v4 as uuidv4 } from "uuid";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadImage = (file, dir) => {

    try {
        if (!file) {
            return ({ error: 'No file uploaded' });
        }

        const imageName = uuidv4() + path.extname(file.originalname);

        const uploadDir = path.join(__dirname, `../../uploads/${dir}`);

        fs.renameSync(file.path, path.join(uploadDir, imageName));

        return { success: true, imageName };

    } catch (error) {
        console.error('Error uploading image:', error);
        return { error: 'An error occurred while uploading the image' };
    }
}
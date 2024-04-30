// multer config
import multer from "multer";
import path from "path";

const multerConfig = {
    dest: 'uploads/testimonials/',
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const extname = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(extname)) {
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'));
        }
        cb(null, true);
    }
}

export const upload = multer(multerConfig);
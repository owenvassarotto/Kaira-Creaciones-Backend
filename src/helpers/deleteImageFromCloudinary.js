import cloudinary from "../config/cloudinaryConfig.js";
import { pool } from "../config/db.js";

const deleteImageFromCloudinary = async (id, dir) => {
  const [previousImage] = await pool.query(
    `SELECT image FROM ${dir} WHERE id = ?`,
    [id]
  );

  if (previousImage[0]?.image) {
    // Extrae el Public ID de la URL de la imagen
    const fileName = previousImage[0].image.split("/").pop().split(".")[0];
    const publicId = `${dir}/${fileName}`;

    try {
      // Elimina la imagen de Cloudinary
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      return res.status(400).json({ message: "Error al eliminar imagen" });
    }
  }
};

export default deleteImageFromCloudinary;

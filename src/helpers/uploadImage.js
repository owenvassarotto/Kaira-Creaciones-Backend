import cloudinary from "../config/cloudinaryConfig.js";

export const uploadImage = async (file, folder) => {
  try {
    if (!file) {
      return { error: "No file uploaded" };
    }

    // Usa el método de Cloudinary para subir la imagen
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder, // Carpeta en la que se guardará la imagen
      transformation: [
        { width: 800, height: 600, crop: "fit", quality: "auto" },
      ],
    });

    // Devuelve la URL de la imagen
    return { success: true, imageUrl: result.secure_url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: "An error occurred while uploading the image" };
  }
};

import { uploadImage } from "../helpers/uploadImage.js";
import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import deleteImageFromCloudinary from "../helpers/deleteImageFromCloudinary.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const getTestimonials = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, image, text_review FROM testimonials WHERE image IS NOT NULL AND text_review IS NOT NULL"
    );

    return res.json(result[0]);
  } catch (error) {
    console.error("Error al obtener las opiniones:", error);
    return res.status(400).json({ message: "Error al obtener las opiniones" });
  }
};

export const createTestimonialFromAdmin = async (req, res) => {
  const { text_review } = req.body;

  try {
    // upload image and get the name to save in db
    const uploadResult = await uploadImage(req.file, "testimonials");

    if (uploadResult.error)
      return res.status(400).json({ error: uploadResult.error });

    const [result] = await pool.query(
      "INSERT INTO testimonials (text_review, image) VALUES (?, ?)",
      [text_review, uploadResult.imageUrl]
    );

    const [newTestimonial] = await pool.query(
      "SELECT id, image, text_review FROM testimonials WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      message: "Opinión creada correctamente",
      newTestimonial: newTestimonial[0],
    });
  } catch (error) {
    console.error("Error al crear opinión:", error);
    return res.status(400).json({ message: "Error al crear opinión" });
  }
};

export const checkToken = async (req, res) => {
  const { token } = req.params;

  const [result] = await pool.query(
    "SELECT * FROM testimonials WHERE token = ?",
    [token]
  );

  const validToken = result.length > 0;

  if (!validToken) return res.status(400).json({ message: "Token no válido" });

  return res.json({ message: "La opinión existe y el token es válido" });
};

export const createTestimonialWithToken = async (req, res) => {
  const token = uuidv4();

  try {
    const [result] = await pool.query(
      "INSERT INTO testimonials (token) VALUES (?)",
      [token]
    );

    const url = process.env.FRONTEND_URL + `/new-testimonial/${token}`;

    if (result.affectedRows > 0)
      return res
        .status(200)
        .json({ message: "Opinión creada correctamente", url });
  } catch (error) {
    console.error("Error al crear opinión:", error);
    return res.status(400).json({ message: "Error al crear opinión" });
  }
};

export const createTestimonialFromUser = async (req, res) => {
  const { token } = req.params;

  const { text_review } = req.body;

  try {
    // upload image and get the name to save in db
    const uploadResult = await uploadImage(req.file, "testimonials");

    if (uploadResult.error)
      return res.status(400).json({ error: uploadResult.error });

    await pool.query(
      'UPDATE testimonials SET text_review = ?, image = ?, token = "" WHERE token = ?',
      [text_review, uploadResult.imageUrl, token]
    );

    const [newTestimonial] = await pool.query(
      "SELECT id, image, text_review FROM testimonials WHERE image = ?",
      [uploadResult.imageUrl]
    );

    return res.status(201).json({
      message: "Opinión creada correctamente",
      newTestimonial: newTestimonial[0],
    });
  } catch (error) {
    console.error("Error al crear opinión:", error);
    return res.status(400).json({ message: "Error al crear opinión" });
  }
};

export const updateTestimonial = async (req, res) => {
  let { id } = req.params;

  const { text_review } = req.body;

  id = parseInt(id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    let uploadResult = { imageName: null };

    if (req.file) {
      await deleteImageFromCloudinary(id, "testimonials");

      // upload image and get the name to save in db
      // Sube la nueva imagen a Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "testimonials",
        use_filename: true,
        unique_filename: false,
      });

      uploadResult.imageUrl = result.secure_url; // Obtén la URL segura de la imagen
    }

    await pool.query(
      "UPDATE testimonials SET image = COALESCE(?, image), text_review = COALESCE(?, text_review) WHERE id = ?",
      [uploadResult.imageUrl, text_review, id]
    );

    const [updatedTestimonial] = await pool.query(
      "SELECT id, image, text_review FROM testimonials WHERE id = ?",
      [id]
    );

    return res.status(201).json({
      message: "Opinión actualizada correctamente",
      updatedTestimonial: updatedTestimonial[0],
    });
  } catch (error) {
    console.error("Error al actualizar la opinión:", error);
    return res.status(400).json({ message: "Error al actualizar la opinión" });
  }
};

// function to DELETE a testimonial
export const deleteTestimonial = async (req, res) => {
  let { id } = req.params;

  id = parseInt(id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const [result] = await pool.query(
      "SELECT * FROM testimonials WHERE id = ?",
      [id]
    );

    if (result.length <= 0)
      return res.status(404).json({ message: "No se encontró la opinión" });

    // delete testimonial image from uploads folder
    await deleteImageFromCloudinary(id, "testimonials");

    await pool.query("DELETE FROM testimonials WHERE id = ?", [id]);

    return res.status(200).json({ message: "Opinión eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la opinión:", error);
    return res.status(400).json({ message: "Error al eliminar la opinión" });
  }
};

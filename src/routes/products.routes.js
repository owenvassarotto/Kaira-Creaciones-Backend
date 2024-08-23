import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";
import { upload } from "../middlewares/multerProducts.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get("/products", getProducts).get("/products/:id", getProduct);

router.post(
  "/products",
  checkAuth,
  isAdmin,
  upload.single("product-image"),
  createProduct
);
router.put(
  "/products/:id",
  checkAuth,
  isAdmin,
  upload.single("product-image"),
  (req, res, next) => {
    updateProduct(req, res);
  }
);

router.delete("/products/:id", checkAuth, isAdmin, deleteProduct);

export default router;

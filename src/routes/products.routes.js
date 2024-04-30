import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/products.controller.js";
import { upload } from "../middlewares/multerProducts.js";
import { checkAuth } from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.get("/products", getProducts)
      .get("/products/:id", getProduct)

router.post("/products", checkAuth, isAdmin, upload.single('product-image'), createProduct)
router.put("/products/:id", checkAuth, isAdmin, (req, res, next) => {

    // if req.body.title is present, it indicates that the user wants to update the product without uploading a new image. This is because on the frontend, the content type will be changed accordingly if an update with a photo is desired or not.
    if(req.body.title){
        updateProduct(req, res);
    }else{
        next();
    }
}, upload.single('product-image'), updateProduct)

router.delete("/products/:id", checkAuth, isAdmin, deleteProduct)

export default router;

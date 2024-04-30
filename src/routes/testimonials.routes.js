import { Router } from "express";
import { createTestimonialFromAdmin, getTestimonials, createTestimonialWithToken, createTestimonialFromUser, updateTestimonial, checkToken, deleteTestimonial } from "../controllers/testimonials.controller.js";
import { upload } from "../middlewares/multerTestimonials.js";
import isAdmin from "../middlewares/isAdmin.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router
    .get('/testimonials', getTestimonials)
    .post('/testimonials/with-token', checkAuth, isAdmin, createTestimonialWithToken)
    .post('/testimonials', checkAuth, isAdmin, upload.single('testimonial-image'), createTestimonialFromAdmin)
    // to update testimonial from admin panel
    .put('/testimonials/admin/:id', checkAuth, isAdmin, (req, res, next) => {

        // if req.body.text_review is present, it indicates that the user wants to update the testimonial without uploading a new image. This is because on the frontend, the content type will be changed accordingly if an update with a photo is desired or not.
        if(req.body.text_review){
            updateTestimonial(req, res);
        }else{
            next();
        }
    }, upload.single('testimonial-image'), updateTestimonial)
    .delete('/testimonials/:id', checkAuth, isAdmin, deleteTestimonial)

router.route('/testimonials/:token').get(checkToken).put(upload.single('testimonial-image'), createTestimonialFromUser)

export default router;
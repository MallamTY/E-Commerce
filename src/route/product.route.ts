import  express from "express";
import {deleteProduct, updateProduct, uploadProduct } from "../controllers/productController";
import userAuth from "../middlewares/auth";
import vendorAuth from "../middlewares/verifyVendor";
import { multerUploads, multiMulterUploads } from "../services/multer";


const router = express.Router();

router.post('/upload', userAuth ,vendorAuth, multiMulterUploads, uploadProduct)

router.delete('/delete/:id', deleteProduct);

router.put('/update/:id', multiMulterUploads,updateProduct);

export default router; 
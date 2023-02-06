import  express from "express";
import {uploadProduct } from "../controllers/productController";
import userAuth from "../middlewares/auth";
import vendorAuth from "../middlewares/verifyVendor";
import { multerUploads, multiMulterUploads } from "../services/multer";


const router = express.Router();

router.post('/uploadproduct', userAuth ,vendorAuth, multiMulterUploads, uploadProduct)

export default router; 
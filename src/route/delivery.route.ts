import express, { Router } from "express";
import { addDeliveryFee, removeDeliveryFee, updateDeliveryFee } from "../controllers/deliveryController";
import userAuth from "../middlewares/auth";
import adminAuth from "../middlewares/verifyAdmin";

const router: Router = express.Router();

router.post('/add-delivery', userAuth, adminAuth, addDeliveryFee);

router.delete('/remove-delivery/:id', userAuth, adminAuth, removeDeliveryFee)

router.put('/update-delivery/:id', userAuth, adminAuth, updateDeliveryFee);

export default router;
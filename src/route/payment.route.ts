import express from "express";
import { checkout } from "../controllers/checkout";
import { payment } from "../controllers/paymentController";

const router = express.Router();

router.post('/payment', payment);

export default router;
// Authentication
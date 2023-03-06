import express from "express";
import { payment } from "../controllers/paymentController";

const router = express.Router();

router.post('/payment', payment);

export default router;

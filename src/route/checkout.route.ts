import express from "express";
import { Middlewares } from "../middlewares";
import { Checkout } from "../controllers";

const router = express.Router();

router.post('/delivery', Middlewares.Authentication, Middlewares.buyerAuth, Checkout.checkout);


export default router;

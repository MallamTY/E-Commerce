import express from "express";
import buyerAuth from "../middlewares/verifyUser";
import userAuth from "../middlewares/auth";
import { Checkout } from "../controllers";

const router = express.Router();

router.post('/delivery', userAuth,buyerAuth, Checkout.checkout);


export default router;

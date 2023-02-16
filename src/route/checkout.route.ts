import { checkout } from "../controllers/checkout";
import express from "express";
import buyerAuth from "../middlewares/verifyUser";
import userAuth from "../middlewares/auth";

const router = express.Router();

router.post('/checkout', userAuth,buyerAuth, checkout);


export default router;
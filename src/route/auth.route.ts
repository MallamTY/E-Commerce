import express from "express";
import { logIn, resendOTP, verifyEmail, verifyOTP } from "../controllers/authController";

const router = express.Router();

router.post('/login', logIn);

router.put('/verify-email/:token', verifyEmail);

router.post('/resent-otp/:user_id', resendOTP);

router.post('/verify-otp/:user_id', verifyOTP);

export default router;

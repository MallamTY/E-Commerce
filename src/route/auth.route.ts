import express from "express";
import { forgetPassword, logIn, resendOTP, resetPassword, verifyEmail, verifyOTP } from "../controllers/authController";

const router = express.Router();

router.post('/login', logIn);

router.put('/verify-email/:token', verifyEmail);

router.post('/resend-otp/:user_id', resendOTP);

router.post('/verify-otp/:user_id', verifyOTP);

router.post('/forget-password', forgetPassword);

router.put('/reset-password/:token', resetPassword);


export default router;

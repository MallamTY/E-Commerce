import express from "express";
import { logIn, verifyEmail } from "../controllers/authController";

const router = express.Router();

router.post('/login', logIn);

router.put('/verify-email/:token', verifyEmail);

export default router;

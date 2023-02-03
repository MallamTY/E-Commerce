import express from "express";
import { logIn, registerUser } from "../controllers/userController";
import { multerUploads } from "../services/multer";

const router = express.Router();

router.post('/register-user', multerUploads, registerUser)

export default router;
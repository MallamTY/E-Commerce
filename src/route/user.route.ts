import express from "express";
import { logIn, registerUser } from "../userController";

const router = express.Router();

router.route('/register-user').post(registerUser);

router.route('/login').post(logIn);


export default router;
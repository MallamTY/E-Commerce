import express from "express";
import { deleteUser, 
        getAllUser, 
        getUser, 
        registerUser
} from "../controllers/userController";
import userAuth from "../middlewares/auth";
import adminAuth from "../middlewares/verifyAdmin";
import { multerUploads } from "../services/multer";

const router = express.Router();

router.post('/register-user', multerUploads, registerUser);

router.get('/get-user', userAuth, adminAuth, getUser);

router.delete('/delete-user', userAuth, adminAuth, deleteUser);

router.get('/get-all-user', userAuth, adminAuth, getAllUser);

export default router;
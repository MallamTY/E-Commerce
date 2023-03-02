import express from "express";
import { forgetPassword, 
        logIn, resendOTP,
        resetPassword, 
        updatedProfilePicture,
        updateUserProfile,
        verifyEmail,
        verifyOTP 
} from "../controllers/authController";
import userAuth from "../middlewares/auth";
import { multerUploads } from "../services/multer";

const router = express.Router();

router.post('/login', logIn);

router.put('/verify-email/:token', verifyEmail);

router.post('/resend-otp/:user_id', resendOTP);

router.post('/verify-otp/:user_id', verifyOTP);

router.post('/forget-password', forgetPassword);

router.put('/reset-password/:token', resetPassword);

router.put('/update-profile', userAuth, updateUserProfile);

router.put('/update-profile-picture', userAuth, multerUploads, updatedProfilePicture);


export default router;

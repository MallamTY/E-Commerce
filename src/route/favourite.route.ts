import express from "express";
import userAuth from "../middlewares/auth";
import buyerAuth from "../middlewares/verifyUser";
import { addOrRemoveProductToFavourite } from "../controllers/favouriteColletion";

const router = express.Router();

router.post('/add-or-remove-favourite', userAuth,buyerAuth,addOrRemoveProductToFavourite);

export default router
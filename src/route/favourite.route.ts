import express from "express";
import userAuth from "../middlewares/auth";
import buyerAuth from "../middlewares/verifyUser";
import { addOrRemoveProductToFavourite, checkProductFromFavourite, deleteFavourite, getFavourite } from "../controllers/favouriteController";

const router = express.Router();

router.post('/add-or-remove', userAuth,buyerAuth, addOrRemoveProductToFavourite);

router.delete('/delete', userAuth,buyerAuth, deleteFavourite);

router.get('/get', userAuth,buyerAuth, getFavourite);

router.get('/check-product', userAuth,buyerAuth, checkProductFromFavourite);

export default router
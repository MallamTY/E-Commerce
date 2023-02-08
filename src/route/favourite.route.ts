import express from "express";
import userAuth from "../middlewares/auth";
import buyerAuth from "../middlewares/verifyUser";
import { addOrRemoveProductToFavourite, checkProductFromFavourite, deleteFavourite, getFavourite } from "../controllers/favouriteController";

const router = express.Router();

router.post('/add-or-remove-favourite', userAuth,buyerAuth, addOrRemoveProductToFavourite);

router.delete('/delete-favourite', userAuth,buyerAuth, deleteFavourite);

router.get('/get-favourites', userAuth,buyerAuth, getFavourite);

router.get('/check-product-in-favourite', userAuth,buyerAuth, checkProductFromFavourite);

export default router
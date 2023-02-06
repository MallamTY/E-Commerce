import express, { Router } from "express";
import { cartProduct,
         decreaseCartByOne,
         deleteCart,
         deleteProductFromCart,
         getCartedProduct,
         IncreaseCartByOne 
        } from "../controllers/cartController";

import userAuth from "../middlewares/auth";
import buyerAuth from "../middlewares/verifyUser";

const router: Router = express.Router();






router.post('/add-cart', userAuth,buyerAuth, cartProduct);

router.post('/decrease-cart', userAuth, buyerAuth, decreaseCartByOne);

router.post('delete-cart', userAuth,buyerAuth, deleteCart);

router.post('increase-carted-product', userAuth,buyerAuth, IncreaseCartByOne);

router.get('/get-carted-product', userAuth,buyerAuth, getCartedProduct);

router.delete('/delete-carted-product', userAuth,buyerAuth, deleteProductFromCart);




export default router;

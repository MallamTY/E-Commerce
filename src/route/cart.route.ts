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






router.post('/add', userAuth,buyerAuth, cartProduct);

 router.post('/decrease-one', userAuth, buyerAuth, decreaseCartByOne);

router.delete('/delete', userAuth,buyerAuth, deleteCart);

 router.post('/increase-one', userAuth,buyerAuth, IncreaseCartByOne);

router.get('/get-product', userAuth,buyerAuth, getCartedProduct);

router.delete('/delete-product', userAuth,buyerAuth, deleteProductFromCart);




export default router;

import express, { Router } from "express";
import CartRoutes from './cart.route';
import FavouriteRoutes from './favourite.route';
import ProductRoutes from './product.route';
import UserRoutes from './user.route';
import AuthRoutes from './auth.route';

const router = express.Router();


router.use('/auth', AuthRoutes);
router.use('/cart', CartRoutes);
router.use('/favourite', FavouriteRoutes);
router.use(ProductRoutes);
router.use(UserRoutes);

export default router;


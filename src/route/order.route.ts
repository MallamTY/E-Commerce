import express from "express";
import {Order} from "../controllers/index";
import { Middlewares } from "../middlewares";

const router = express.Router();

router.put('/update', Middlewares.Authentication, Middlewares.adminAuth, Order.updateOrder);

router.post('/get-single', Middlewares. Authentication, Middlewares.adminAuth, Order.getSingleOrder);

router.get('/get-all', Middlewares.Authentication, Middlewares.adminAuth, Order.getAllOrder);

router.post('/delete/', Middlewares.Authentication, Middlewares.adminAuth, Order.deleteOrder);

export default router;

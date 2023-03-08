import express from "express";
import { deleteOrder, getAllOrder, getSingleOrder, updateOrder } from "../controllers/orderStateController";
import { Middlewares } from "../middlewares";

const router = express.Router();

router.put('/update', Middlewares.Authentication, Middlewares.adminAuth, updateOrder);

router.get('/get-single', Middlewares. Authentication, Middlewares.adminAuth, getSingleOrder);

router.get('/get-all', Middlewares.Authentication, Middlewares.adminAuth, getAllOrder);

router.delete('/delete', Middlewares.Authentication, Middlewares.adminAuth, deleteOrder);

export default router;

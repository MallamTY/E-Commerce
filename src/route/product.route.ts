import  express from "express";
import { Product } from "../controllers/index";
import { Middlewares } from "../middlewares";
import { multiMulterUploads } from "../services/multer";


const router = express.Router();

router.post('/upload', Middlewares.Authentication , Middlewares.vendorAuth, multiMulterUploads, Product.uploadProduct)

router.delete('/delete/:id', Middlewares.Authentication, Middlewares.adminAuth, Product.deleteProduct);

router.put('/update/:id', Middlewares.Authentication , Middlewares.vendorAuth, multiMulterUploads, Product.updateProduct);

router.get('/get-single/:id', Middlewares.Authentication, Product.getProduct);

router.get('/get-all', Middlewares.Authentication, Product.getAllProduct)

export default router; 

//vender  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQwYTA4YjMzNWRmYzBiNjJiNTA0OTVhIiwicm9sZSI6InZlbmRvciIsImVtYWlsIjoidG5zb3NhbnlhQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiS2hlZmZ5IiwiaWF0IjoxNjc4Mzk4MDAyLCJleHAiOjE2Nzg1NzA4MDJ9.OZgHJkyuJd4dVWdLjygNAM0vLjviebW5ACnQ69ZYji0
//admin eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQwYTA0MzY5OGRiMzU5OTdlYjllMGMzIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJ0bnNvc2FueWFAc3R1ZGVudC5vYXVpZmUuZWR1Lm5nIiwidXNlcm5hbWUiOiJNYWxsYW1UWSIsImlhdCI6MTY3ODM5ODQzNiwiZXhwIjoxNjc4NTcxMjM2fQ.-oJE0XrdzQmhx_ear9KznscvngF7bIys3ILV-oL4TnE
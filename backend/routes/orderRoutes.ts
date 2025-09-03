import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { createOrUpdateOrder, createPaymentWithRazorpay, getOrderById, getUserOrders } from "../controllers/orderController";


const router = Router();

router.post("/",authenticateUser,createOrUpdateOrder);
router.patch("/",authenticateUser,createOrUpdateOrder);
router.get("/",authenticateUser,getUserOrders);
router.get("/:orderId",authenticateUser,getOrderById);
router.post("/razorpay-payment",authenticateUser,createPaymentWithRazorpay);


export default router;
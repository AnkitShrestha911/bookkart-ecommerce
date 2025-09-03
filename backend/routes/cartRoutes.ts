import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { addToCart, clearUserCart, getCartByUser, removeFromCart, removeProductFromCart } from "../controllers/cartController";

const router = Router();

router.post("/add",authenticateUser,addToCart);
router.get("/:userId",authenticateUser,getCartByUser);
router.patch("/:productId/decrement",authenticateUser,removeFromCart);
router.patch("/clear-cart/:userId",authenticateUser,clearUserCart);
router.delete("/remove/:productId",authenticateUser,removeProductFromCart);

export default router;
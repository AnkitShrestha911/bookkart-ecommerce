import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";

import { addToWishList, findProductInWishList, getAllWishListByUser, getWishListByUser, removeFromWishList } from "../controllers/wishlistController";

const router = Router();

router.post("/add",authenticateUser,addToWishList);
router.get("/find/:productId",authenticateUser,findProductInWishList);
router.get("/all/:userId",authenticateUser,getAllWishListByUser);
router.get("/single/:userId",authenticateUser,getWishListByUser);
router.delete("/remove/:productId",authenticateUser,removeFromWishList);

export default router;
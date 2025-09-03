import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudinaryConfig";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	getProductBySellerId,
} from "../controllers/productController";

const router = Router();

router.post("/", authenticateUser, multerMiddleware, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/seller/:productId", authenticateUser, deleteProduct);
router.get("/seller/:sellerId", authenticateUser, getProductBySellerId);

export default router;

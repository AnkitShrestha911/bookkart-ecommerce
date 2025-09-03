import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { updateUserProfile } from "../controllers/userController";


const router = Router();

router.patch("/profile/update/:userId",authenticateUser,updateUserProfile)

export default router;
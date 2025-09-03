import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { createOrUpateAddressByUserId, getAddressByUserId } from "../controllers/addressController";


const router = Router();

router.post("/save",authenticateUser,createOrUpateAddressByUserId);
router.get("/",authenticateUser,getAddressByUserId);

export default router;
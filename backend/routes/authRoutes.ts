import { NextFunction, Request, Response, Router } from "express";
import { forgotPassword, login, register, verifyEmail, resetPassword, logout, checkUserAuth, checkUserIsLogin } from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";
import passport from "passport";
import { USER } from "../models/User";
import { generateToken } from "../utils/generateToken";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.get("/logout",logout);
router.get("/verify-auth",authenticateUser,checkUserAuth);
router.get("/check-login",checkUserIsLogin);
router.get("/google",passport.authenticate('google',{scope:['profile',"email"]}))

// google callback route
router.get("/google/callback",passport.authenticate('google',{
  failureRedirect:`${process.env.FRONTEND_URL}`,
  session:false
}),
  async (req:Request,res:Response, next:NextFunction): Promise<void> => {
    try {
      const user = req.user as USER
      const accessToken = await generateToken(user);
      res.cookie("accessToken",accessToken, {
        httpOnly:true,
        maxAge: 60 * 60 * 24 * 1000
      })

      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (err) {
      next(err);
    }

  }
)
export default router;
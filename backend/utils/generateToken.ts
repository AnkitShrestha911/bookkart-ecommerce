import jwt from "jsonwebtoken"
import { USER } from "../models/User"

export const generateToken = (user:USER): string => {
  return jwt.sign({userId:user?._id},process.env.JWT_SECRET as string, {expiresIn:'1d'});
}
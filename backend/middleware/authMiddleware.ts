import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export const authenticateUser = async(req:Request, res:Response, next:NextFunction) => {
  const token = req.cookies.accessToken;

  if(!token) {
    return response(res,401,"User is not authenticatd, no token is missing");
  }

  try{
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if(!decodeToken || !decodeToken.userId) {
      return response(res,401,"User is not authorized, user not found");
    }

    req.userId = decodeToken.userId;
    next();

  }catch(err) {
    return response(res,401,"Not authorized user or Invalid or expired token");
  }

}
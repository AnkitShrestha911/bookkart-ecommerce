import multer from "multer"
import {v2 as cloudinary, UploadApiOptions, UploadApiResponse} from "cloudinary"
import dotenv from "dotenv"
import { RequestHandler } from "express";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
})

interface CustomFile extends Express.Multer.File {
  path:string;
}

const uploadToCloudinary=(file:CustomFile):Promise<UploadApiResponse> => {
  const options: UploadApiOptions = {
    resource_type:'image',
  } 

  return new Promise((res,rej) => {
    cloudinary.uploader.upload(file.path,options,(err,result) => {
      if(err) {
        return rej(err);
      }
      return res(result as UploadApiResponse);
    })
  })
}

const multerMiddleware: RequestHandler = multer({dest:"uploads/"}).array('images',4);

export {multerMiddleware,uploadToCloudinary};



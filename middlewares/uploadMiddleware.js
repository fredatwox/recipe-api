import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


export const recipePictures = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
       folder: '/recipe-api/recipes',
  
     },
  })

});


export const profilePictures = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "/recipe-api/profiles",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 300, height: 300, crop: "thumb", gravity: "face" }]
    }
  }),
  limits: { fileSize: 3 * 1024 * 1024 } // 3 MB limit
});
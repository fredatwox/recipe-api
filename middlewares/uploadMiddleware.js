import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";



// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage for recipe images
 const recipeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipe-api/recipes", // No leading slash needed
    allowed_formats: ["jpg", "jpeg", "png"]
  }
});


export const storage = multer.memoryStorage(); // or diskStorage({ destination: 'uploads/' }) for file storage

// Multer middleware for uploading recipe pictures
export const uploadRecipePicture = multer({ storage: recipeStorage }).single("image"); // form field name = "image"
// Cloudinary config and storage setup...


// Cloudinary storage for profile pictures
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipe-api/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 300, height: 300, crop: "thumb", gravity: "face" }
    ]
  }
});

// Multer middleware for uploading profile pictures
export const uploadProfilePicture = multer({
  storage: profileStorage,
  limits: { fileSize: 3 * 1024 * 1024 } // 3MB file size limit
}).single("image"); // form field name = "image"

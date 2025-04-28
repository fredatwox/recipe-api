import { Router } from "express";
import {
  createRecipe,
  getAllRecipes,
  getMyRecipe,
  updateRecipe,
  deleteRecipe
} from "../controllers/recipeController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { uploadRecipePicture } from "../middlewares/uploadMiddleware.js";
import { recipeModel } from "../models/Recipe.js";




//create user route

const recipeRouter = Router();

recipeRouter.get("/recipes", getAllRecipes);
recipeRouter.post("/recipe", isAuthenticated,
  isAuthorized(['chef', 'admin']), uploadRecipePicture, createRecipe);
recipeRouter.get("/recipe/:id", isAuthenticated, getMyRecipe);
recipeRouter.patch("/recipe/:id", isAuthenticated, isAuthorized(['chef', 'admin']), updateRecipe);
recipeRouter.delete("/recipe/:id", isAuthenticated, isAuthorized(['chef', 'admin']), deleteRecipe);


// Cloudinary config and storage setup...




// Upload image and save to recipe
recipeRouter.post(
  "/recipe/:id/upload-image",
  isAuthenticated,
  uploadRecipePicture,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const recipeId = req.params.id;
      const imageUrl = req.file.path; // Cloudinary URL

      // Update the recipe with the image URL
      const updatedRecipe = await recipeModel.findByIdAndUpdate(
        recipeId,
        { image: imageUrl },
        { new: true }
      );

      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      res.status(200).json({
        message: "Recipe image uploaded and saved successfully",
        recipe: updatedRecipe
      });

    } catch (error) {
      console.error("Error uploading and saving recipe image:", error);
      res.status(500).json({ message: "Server error during image upload" });
    }
  }
);



export default recipeRouter;
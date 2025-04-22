import { Router } from "express";
import {
  createRecipe,
  getAllRecipes,
  getMyRecipe,
  updateRecipe,
  deleteRecipe
} from "../controllers/recipeController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { recipePictures } from "../middlewares/uploadMiddleware.js";



//create user route

const recipeRouter = Router();

recipeRouter.get("/recipes", getAllRecipes);
recipeRouter.post("/recipe",  isAuthenticated, 
  isAuthorized (['chef', 'admin']),  recipePictures.single("image"),  createRecipe);
recipeRouter.get("/recipe/:id", isAuthenticated,  getMyRecipe);
recipeRouter.patch("/recipe/:id", isAuthenticated, isAuthorized,  updateRecipe);
recipeRouter.delete("/recipe/:id", isAuthenticated, isAuthorized,  deleteRecipe);


export default recipeRouter;
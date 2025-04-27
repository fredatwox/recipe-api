import { recipeModel } from "../models/Recipe.js";




export const createRecipe = async (req, res) => {
  try {
     const { title, description, ingredients, category, cookingInstructions, } = req.body;
    const image = req.file ? req.file.filename : null;
    const newRecipe = await recipeModel.create({
      title,
      description,
      ingredients,
      category,
      cookingInstructions,
      image,
      chef: req.user.id
    });
    await newRecipe.save();
    res.status(201).json({message: 'Recipe created scuccesfully'},newRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };
    const recipes = await recipeModel.find(filter).populate("chef", "name");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getMyRecipe = async (req, res) => {
  try {

    const recipeId = req.params.id;

    const recipe = await recipeModel
      .findById(recipeId)
      .populate('chef', 'fullName email'); // populate chef's name/email if needed

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
      // Optional: Only allow owner to access
    // if (recipe.chef.toString() !== userId) {
    //   return res.status(403).json({ error: 'Access denied' });
    // }

    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: 'Unauthorized: Missing user data' });
    }

    const recipe = await recipeModel.findById(recipeId).populate('chef');
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    
    console.log('Recipe Chef:', recipe.chef);
    console.log('Logged In User ID:', userId);

    const isOwnerChef = recipe.chef._id.toString() === userId;

    if (!isOwnerChef) {
      return res.status(403).json({ error: 'You are not authorized to update this recipe' });
    }

    // Filter only the fields you allow to be updated
    const updatableFields = ['title', 'ingredients', 'description', 'totalTime', 'category'];
    const updates = {};

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedRecipe = await recipeModel.findByIdAndUpdate(recipeId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteRecipe = async (req, res) => {
  try {

     // Log the JWT payload (set by express-jwt)
     console.log(" Authenticated User:", req.user);


    const recipeId = req.params.id;
    const userId = req.user?.userId || req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ error: 'Unauthorized: Missing user data' });
    }

    const recipe = await recipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const isOwnerChef = recipe.chef.toString() === userId.toString();

    if (!isOwnerChef && userRole !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to delete this recipe' });
    }

    await recipeModel.findByIdAndDelete(recipeId);

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(" Error in deleteRecipe:", err);
    res.status(500).json({ error: err.message });
  }
};


import { Schema, model, Types } from "mongoose";
import normalize  from "normalize-mongoose";



const recipeSchema = new Schema({
  title: {type: String, required: true, unique: true },
  category: {type: String,  enum: ["Traditional", "Soups", "Street Food", "Desserts"],  required: true},
  imageUrl: {type: String, },
  ingredients: {type: String, required: true},
  description: {type: String, required: true },
  cookingInstructions: {type: String, required: true},
  chef: { type: Types.ObjectId, required: true, ref: "User" }
},
{ timestamps: true });


recipeSchema.plugin(normalize);

export const recipeModel = model("Recipe", recipeSchema);
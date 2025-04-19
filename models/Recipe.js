
import { Schema, model, Types } from "mongoose";
import normalize  from "normalize-mongoose";



const recipeSchema = new Schema({
  title: {type: String, required: true, unique: true },
  description: {type: String, required: true, unique: true},
  ingredients: {type: String, required: true},
  steps: {type: String, required: true},
  category: {type: String, required: true},
  totalTime: {type: String, required: true},
  difficulty: {type: String, required: true},
  image: {type: String, required: true},
  chef: { type: Types.ObjectId, required: true, ref: "User" }
},
{ timestamps: true });


recipeSchema.plugin(normalize);

export const recipeModel = model("Recipe", recipeSchema);
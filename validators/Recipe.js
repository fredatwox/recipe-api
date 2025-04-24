
import Joi from "joi";



export const addRecipeValidator = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().valid("Traditional", "Soups", "Street Food", "Desserts").required(),
    image: Joi.string().required(),
    ingredients: Joi.string().required(),
    description: Joi.string().required(),
    cookingInstructions: Joi.string().required(),
    
});
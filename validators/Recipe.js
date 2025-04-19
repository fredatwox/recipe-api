
import Joi from "joi";



export const addRecipeValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.string().required(),
    steps: Joi.string().required(),
    category: Joi.string().required(),
    totalTime: Joi.string().required(),
    difficulty: Joi.string().valid("easy", "medium", "hard", "advanced").required(),
    image: Joi.string().required(),
    
});
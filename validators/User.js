import Joi from "joi";



export const registerUserValidator = Joi.object({
  fullName: Joi.string().required().messages({
    'string.empty': 'Fulll name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Emaill is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Please confirm your password',
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Country is required',
  }),
  role: Joi.string().valid('chef', 'food_lover').required().messages({
    'any.only': 'Role must be either "chef" or "food_lover"',
    'string.empty': 'Role is required',
  }),
});


export const loginUserValidator = Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email(),
    password: Joi.string().required(),
}).or('name', 'email'); // At least one of name or email must be present
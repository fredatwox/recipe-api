import { Router } from "express";
import { register, login } from "../controllers/authController.js";


//create user route

const userRouter = Router();

userRouter.post("/auth/register", register);
userRouter.post("/auth/login", login);



export default  userRouter;
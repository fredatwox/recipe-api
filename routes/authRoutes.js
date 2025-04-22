import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";


//create user route

const authRouter = Router();

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.post("/auth/logout", logout);




export default  authRouter;
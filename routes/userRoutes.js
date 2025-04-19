import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  toggleBookmark,
  getBookmarks
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";




//create user route

const userRouter = Router();


userRouter.get("/profile", isAuthenticated, getMyProfile);
userRouter.patch("/profile", isAuthenticated, updateMyProfile);
userRouter.delete('/profile', isAuthenticated, deleteMyProfile);
userRouter.post("/bookmark",   toggleBookmark);
userRouter.get("/bookmarks",   getBookmarks);



export default userRouter;
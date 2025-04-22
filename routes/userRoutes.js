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
userRouter.post("/bookmark",  isAuthenticated, toggleBookmark);
userRouter.get("/bookmarks", isAuthenticated,  getBookmarks);




export default userRouter;
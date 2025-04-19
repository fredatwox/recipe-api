import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";




mongoose.connect(process.env.MONGO_URI, {
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));
 
    

//create an express app
const app = express();



//middleware
app.use(express.json());



//Routes to use
app.use("/api/v1", authRouter );
app.use("/api/v1", userRouter );
app.use("/api/v1", recipeRouter);


//listening to incoming request
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
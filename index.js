import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import recipeRouter from "./routes/recipeRoutes.js";
import cors from "cors";




mongoose.connect(process.env.MONGO_URI, {
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));
 
    

//create an express app
const app = express();



//middleware
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

//Routes to use
app.use("/api/v1", authRouter );
app.use("/api/v1", userRouter );
app.use("/api/v1", recipeRouter);


// Handle JWT errors from express-jwt
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid or missing token" });
  }
  next(err);
});


//listening to incoming request
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
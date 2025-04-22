import { expressjwt } from "express-jwt";
import { userModel } from "../models/User.js";




export const isAuthenticated = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user' // this ensures JWT payload is on req.user
});


export const isAuthorized =(roles) => {
  return async (req, res, next) => {
      
    try{
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: No user ID in token' });
      }
      // find user by id
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: 'You are not authorized to perform this action' });
      }

        // Optionally attach user to req for further use
        req.user = user;

    
          next();
      } catch {
          res.status(403).json('You are not authorized');
      }
    }
};

// export const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(403).json({ message: "Invalid token" });
//   }
// };





// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
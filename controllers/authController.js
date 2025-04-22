import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";
import {registerUserValidator, loginUserValidator } from "../validators/user.js";




export const register = async (req, res, ) => {
  //Validate user information
  const {error, value} = registerUserValidator.validate(req.body);
  if (error) {
      return res.status(422).json(error);
  }

  //check if your user does not exist already
  const user = await userModel.findOne({ email: req.body.email});
 if (user) {
     return res.status(409).json('User already exist!');
 } 

  //hash plaintext password
  const hashedPassword = bcrypt.hashSync(value.password, 12);
  
 
  
  //create user record in database
  const newUser = await userModel.create({
      ...value,
      password: hashedPassword
  });

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const verificationLink = `http://yourfrontend.com/verify-email?token=${token}`;
//    
// // Send registration email to user
//  await mailTransporter.sendMail({
//      from:'Nnoboa35@gmail.com',
//      to: value.email,
//      subject: 'Nodemailer worked successfuly',
//      html: registerUserMailTemplate.replace('{{username}}', value.username),
//  })
 //(optionally) Generate access token for user 
 //retun response
 res.status(201).json({
     message:'User registered. Check email to verify.', 
     user: newUser 
 });
}


export const login = async (req, res) => {
    // 1. Validate input
    const { error, value } = loginUserValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    // 2. Find user by name or email
    const user = await userModel.findOne({ email: req.body.email });
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    // 3. Compare passwords
    const isPasswordValid = bcrypt.compareSync(value.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // 4. Generate access token
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role }, // include role/name if needed later
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000
    });
  
    // 5. Send response
    res.status(200).json({
      message: 'User logged in successfully!',
      accessToken
    });
  };


  export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  };

  

  export const verifyEmail = async (req, res) => {
    try {
      const { token } = req.query;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await userModel.findByIdAndUpdate(decoded.userId, { isVerified: true }, { new: true });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      res.json({ message: "Email verified successfully!" });
    } catch {
      res.status(400).json({ error: "Invalid or expired token" });
    }
  };


  export const forgotPassword = async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "User not found" });
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;
  
    await mailTransporter.sendMail({
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>Click to reset password:</p><a href="${resetLink}">Reset Password</a>`
    });
  
    res.json({ message: "Password reset link sent" });
  };


  
  export const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = bcrypt.hashSync(newPassword, 12);
      await userModel.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
      res.json({ message: "Password reset successful" });
    } catch {
      res.status(400).json({ error: "Invalid or expired token" });
    }
  };
  



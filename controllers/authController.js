import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";
import {registerUserValidator, loginUserValidator } from "../validators/user.js";




export const register = async (req, res, next) => {
  //Validate user information
  const {error, value} = registerUserValidator.validate(req.body);
  if (error) {
      return res.status(422).json(error);
  }

  //check if your user does not exist already
  const user = await userModel.findOne({ email: value.email});
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

//    // Send registration email to user
//  await mailTransporter.sendMail({
//      from:'Nnoboa35@gmail.com',
//      to: value.email,
//      subject: 'Nodemailer worked successfuly',
//      html: registerUserMailTemplate.replace('{{username}}', value.username),
//  })
 //(optionally) Generate access token for user 
 //retun response
 res.status(201).json({
     message:'User registered succefully', 
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
    const user = await userModel.findOne({ email: value.email });
  
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
      { id: user._id, name: user.name, role: user.role }, // include role/name if needed later
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  
    // 5. Send response
    res.status(200).json({
      message: 'User logged in successfully!',
      accessToken
    });
  };




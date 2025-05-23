
import {Schema, model, Types} from "mongoose";
import  normalize from "normalize-mongoose";




const userSchema = new Schema({
  fullName: {type: String, required: true, },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: {type: String, required: true },
  country: {type: String, required: true},
  role: { type: String, enum: ["chef", "food_lover"], required: true},

  
}, {
 timestamps: true

});

userSchema.plugin(normalize);

export const userModel = model("User", userSchema);
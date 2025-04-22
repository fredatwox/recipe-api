import { userModel } from "../models/User.js";




export const getMyProfile = async (req, res) => {
  try {
    
    const user = await userModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;

      // Ensure you don't allow updating password directly (you can add logic to handle this separately)
      if (updates.password) {
        return res.status(400).json({ error: 'Password cannot be updated this way' });
      }


    const user = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");

    res.json({message: 'Profile updated successfully', user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteMyProfile = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Your profile has been deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const toggleBookmark = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const { recipeId } = req.body;

    
    if (!Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ error: 'Invalid recipe ID' });
    }
    
    const index = user.bookmarkedRecipes.indexOf(recipeId);
    if (index > -1) {
      user.bookmarkedRecipes.splice(index, 1);
    } else {
      user.bookmarkedRecipes.push(recipeId);
    }
    await user.save();
    res.json({ message: "Bookmark updated", bookmarks: user.bookmarkedRecipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getBookmarks = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("bookmarkedRecipes");
    res.json(user.bookmarkedRecipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
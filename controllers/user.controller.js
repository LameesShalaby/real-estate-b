// import bcrypt from "bcrypt";
import User from "../db/models/user.model.js";


// Get All users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users", error: err.message });
  }
};

// Add User
export const addUser = async (req, res) => {
  try {
    const { username, email, password,  phoneNumber,role, avatar } = req.body;

    // Verify the existence of the password
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, 
      phoneNumber,
      role,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "Failed to add user", error: err.message });
  }
};



//UpdateUser

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, password, role, phoneNumber, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password, role, phoneNumber, avatar },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Failed to update user", error: err.message });
  }
};


// Delete User

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "user deleted successfully" });
  }
   catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};


// update Password


// update profile

export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, avatar, phoneNumber } = req.body;

  try {
    const updates = {};

    if (username) updates.username = username;
    if (avatar) updates.avatar = avatar;
    if (phoneNumber) updates.phoneNumber = phoneNumber;

    const updatedProfile = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedProfile });
  } catch (err) {
    res.status(500).json({ error: "There was an error while updating the profile." });
  }
};

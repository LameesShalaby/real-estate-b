import bcryptjs from "bcryptjs";
import User from "../db/models/user.model.js";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";



dotenv.config();

// Get All users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve users", error: err.message });
  }
};

// getUserId

export const getUserId = async(req, res) =>{

  try{
    // const id = req.params.id
    const token = req.headers['token']
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    console.log(token)
    console.log(decoded)
    const {id} = decoded
    const user = await User.findById(id)
    res.status(200).json(user)
  }
  
  catch (err) {
    res.status(500).json(err)
  }
};

// Add User
export const addUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role, avatar } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hashed Password
    const hashedPassword = await bcryptjs.hash(password, 10);

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

// Update User
export const updateUser = async (req, res) => {
  try {
    const { username, email, password, role, phoneNumber, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, password, role, phoneNumber, avatar },
      { new: true , runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update user", error: err.message });
  }
};

// export const updateUser = async (req, res) => {
//   try {
//     const { username, email, password, role, phoneNumber, avatar } = req.body;
//     const updateFields = {};

//     // Check which fields were provided and should be updated
//     if (username) updateFields.username = username;
//     if (email) updateFields.email = email;
//     if (role) updateFields.role = role;
//     if (phoneNumber) updateFields.phoneNumber = phoneNumber;
//     if (avatar) updateFields.avatar = avatar;

//     // If password is provided, hash it before updating
//     if (password) {
//       const salt = await bcryptjs.genSalt(10);
//       updateFields.password = await bcryptjs.hash(password, salt);
//     }

//     // Find user by ID and update
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updateFields },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "User updated successfully",
//       user: updatedUser,
//     });
//   } catch (err) {
//     res.status(400).json({ message: "Failed to update user", error: err.message });
//   }
// };

// update pass (otp)

export const updatePasswordWithOTP = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update password", error: err.message });
  }
};

// Delete User

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// import bcrypt from "bcrypt";
import User from "../db/models/user.model.js";


// Get All users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to get users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// Add User

export const addUser = async (req, res) => {
  const { userName, email, password } = req.body;
  const user = new User({ userName, email, password });
  try {
    const newuser = await user.save();
    res.status(201).json(newuser);
  } catch (err) {
    res.status(400).json({ message: "Faild to add user", err });
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
    console.log(user);
    const usersAfterDelete = await User.find();
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

// updatedPassword
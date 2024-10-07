// import bcrypt from "bcrypt";
import User from "../db/models/user.model.js";


// Get All users


// Add User


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
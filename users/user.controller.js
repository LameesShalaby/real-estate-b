import User from "../models/user.model.js"; 

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { userName, email, password, role } = req.body;
    await User.findByIdAndUpdate(id, { userName, email, password, role });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to update user", err });
  }
};

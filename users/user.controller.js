import bcrypt from "bcrypt";
import User from "../db/users/userSchema.js";
import { registerValidation } from "../validation/registerValidation .js";

export const register = async (req, res) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password, role, phoneNumber } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      phoneNumber,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

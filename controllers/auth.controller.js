import bcrypt from "bcrypt";
import User from "../db/models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { registerValidation } from "../validation/registerValidation.js";
import { loginValidation } from "../validation/loginValidation.js";

// Register

export const register = async (req, res) => {
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, username, password, role, phoneNumber, avatar } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role,
      phoneNumber,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
};

// Login

export const login = async (req, res) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).send("Wrong Email or password!");
    }
    const matchPassword = await bcrypt.compare(password, findUser.password);
    if (matchPassword) {
      const token = jwt.sign(
        { id: findUser._id, email: findUser.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        message: "Logged in successfully",
        user: {
          id: findUser._id,
          email: findUser.email,
          username: findUser.username,
        },
        token,
      });
    } else {
      res.status(400).send("Wrong Email or password!");
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


// Nodemailer
// For demonstration: configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You can reset your password using this token: ${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
    console.log("Token received:", token);

  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token", error });
  }
};

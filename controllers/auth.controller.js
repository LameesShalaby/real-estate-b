import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../db/models/user.model.js";
import nodemailer from "nodemailer";
import Joi from "joi";

// Register
export const registerUser = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { username, email, password, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already registered.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Login
export const loginUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid Email or Password.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid Email or Password.");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


// Forget Password - Send OTP
export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found.");

    const otp = crypto.randomInt(100000, 999999);
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Error sending email.");
      } else {
        res.status(200).send("OTP sent to your email.");
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
    newPassword: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email.");

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).send("Invalid or expired OTP.");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).send("Password reset successfully.");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -__v -role");

    if (!user) return res.status(404).send("User not found.");

    res.json(user);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

// Update User
export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const { username, email, phoneNumber } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found.");

    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();
    res.status(200).send("User updated successfully.");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  const userId = req.user._id;

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully.");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// import User from "../db/models/user.model.js";
// // asyncHandler: Middleware to handle errors in asynchronous functions, catching them and passing them to Express's error-handling mechanism.
// import asyncHandler from "express-async-handler";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// // Each function is exported and wrapped with express-async-handler to catch and handle any asynchronous errors automatically.

// export const getForgotPasswordView = asyncHandler((req, res) => {
//   res.json("forgot-password");
// });

// export const sendForgotPasswordLink = asyncHandler(async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(404).json({ message: "user not found" });
//   }
//   const secret = process.env.JWT_SECRET_KEY + user.password;
//   const token = jwt.sign({ email: user.email, id: user.id }, secret, {
//     expiresIn: "10m",
//   });
//   const link = `http://localhost:3000/password/reset-password/${user._id}/${token}`;
//   res.json({ message: "click on the link", resetPasswordLink: link });
// });
// export const getResetPasswordView = asyncHandler(async (req, res) => {
    
// const user = await User.findById(req.params.userId);
//   if (!user) {
//     return res.status(404).json({ message: "user not found" });
//   }

//   const secret = process.env.JWT_SECRET_KEY + user.password;
//   try {
//     jwt.verify(req.params.token, secret);
//     res.json("reset-password", { email: user.email });
//   } catch (error) {
//     console.log(error);
//     res.json({ message: "Error" });
//   }
// });
// export const resetThePassword = asyncHandler(async (req, res) => {
// const user = await User.findById(req.params.userId);

//   if (!user) {
//     return res.status(404).json({ message: "user not found" });
//   }

//   const secret = process.env.JWT_SECRET_KEY + user.password;
//   try {
//     jwt.verify(req.params.token, secret);

//     const salt = await bcrypt.genSalt(10);
//     req.body.password = await bcrypt.hash(req.body.password, salt);
//     user.password = req.body.password;

//     await user.save();
//     res.json("success-password");
//   } catch (error) {
//     console.log(error);
//     res.json({ message: "Error" });
//   }
// });

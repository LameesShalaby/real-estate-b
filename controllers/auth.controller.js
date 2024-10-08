import bcrypt from "bcrypt";
import User from "../db/models/user.model.js";
import jwt from "jsonwebtoken"
import { registerValidation } from "../validation/registerValidation .js";
import { loginValidation } from "../validation/loginValidation.js";

// Register

export const register = async (req, res) => {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    const { email, username, password, role, phoneNumber } = req.body;
  
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
      
      //find the user
      // const findUser = User.find((user) => user.username === username)
      const findUser = await User.findOne({ email });
      if (!findUser) {
        res.status(400).send("Wrong Email or password!");
        return;
      }
      const matchPassword = await bcrypt.compare(password, findUser.password);
      if (matchPassword) {
        //check if password match or not
        const token = jwt.sign({id: findUser._id, email: findUser.email}, process.env.SECRET_KEY, { expiresIn: "1h" });

        // res.status(200).send("Logged in successfully",{...other, token});

        res.status(200).json({ message: "Logged in successfully", user: { id: findUser._id, email: findUser.email, username: findUser.username }, token });

      } else {
        res.status(400).send("Wrong Email or password!");
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
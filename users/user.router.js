import {updateUser } from "./user.controller.js"; 

import express from "express";
const router = express.Router();

router.patch("/", updateUser);

export default router;
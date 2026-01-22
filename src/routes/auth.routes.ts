import express from "express";
import config from "../config/index";

import UserRepository from "../repositories/user.repository";
import UserService from "@/services/auth.service";
import UserController from "@/controller/auth.controller";

const router = express.Router();

// repository
const userRepository = new UserRepository();

// service
const userService = new UserService(userRepository);

//controller
const userController = new UserController(userService);



// Public routes
router.post("/register", userController.register);



export default router;
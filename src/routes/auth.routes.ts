import express from "express";
import config from "../config/index";

import UserRepository from "../repositories/user.repository";
import UserService from "@/services/auth.service";
import UserController from "@/controller/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = express.Router();

// repository
const userRepository = new UserRepository();

// service
const userService = new UserService(userRepository);

//controller
const userController = new UserController(userService);



// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/activate-2fa",
    authMiddleware({
        stage: ['password'],
        repositories: { userRepository }
    }),
    userController.activate2FA);


router.post("/verify-2fa",
    authMiddleware({
        stage: ['password'],
        repositories: { userRepository }
    }),
    userController.verify2Fa);

export default router;
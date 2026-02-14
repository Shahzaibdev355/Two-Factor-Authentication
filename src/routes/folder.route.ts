import express from "express";
import FolderRepository from "../repositories/folder.repository";
import FolderService from "../services/folder.service";
import FolderController from "../controller/folder.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import UserRepository from "../repositories/user.repository";
import ImageRepository from "../repositories/image.repository";


const router = express.Router();

const folderRepository = new FolderRepository();
const imageRepository = new ImageRepository();

const folderService = new FolderService(folderRepository, imageRepository);

const folderController = new FolderController(folderService);

const userRepository = new UserRepository();

router.post(
    "/create-folder",
    authMiddleware({
        stage: ["password", "2fa"],
        repositories: { userRepository },
    }),
    folderController.create
);

router.get(
    "/get-folder",
    authMiddleware({
        stage: ["password", "2fa"],
        repositories: { userRepository },
    }),
    folderController.getAll
);

router.delete(
    "/delete-folder/:id",
    authMiddleware({
        stage: ["password", "2fa"],
        repositories: { userRepository },
    }),
    folderController.delete
);

export default router;

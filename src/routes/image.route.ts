import express from "express";
import { upload } from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import UserRepository from "../repositories/user.repository";
import ImageRepository from "../repositories/image.repository";
import ImageService from "../services/image.service";
import ImageController from "../controller/image.controller";


const imageRepository = new ImageRepository();
const imageService = new ImageService(imageRepository);
const imageController = new ImageController(imageService);

const userRepository = new UserRepository();

const router = express.Router();

router.post(
    "/image-upload/:folderId",
    authMiddleware({
        stage: ["password", "2fa"],
        repositories: { userRepository },
    }),
    upload.single("image"),
    imageController.upload
);


router.get(
    "/get-images",
    authMiddleware({
        stage: ["password", "2fa"],
        repositories: { userRepository },
    }),
    imageController.getAll
);

router.delete(
    "/image-delete/:imageId",
    authMiddleware({
        stage: ["password", "2fa"],
        repositories: { userRepository },
    }),
    imageController.delete
);

export default router;

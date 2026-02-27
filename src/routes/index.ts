import express from "express";
import auth from "./auth.routes";
import folderRoutes from "./folder.route";
import imageRoutes from "./image.route";
import cronRoutes from "./cron.route";

const router = express.Router();

router.use("/auth", auth);

router.use("/folders", folderRoutes);

router.use("/images", imageRoutes);

router.use("/cron", cronRoutes);


export default router;
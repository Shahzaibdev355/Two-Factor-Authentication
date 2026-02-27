import { Router } from "express";
import { keepAlive } from "../controller/cron.controller";

const router = Router();

router.get("/keep-alive", keepAlive);

export default router;


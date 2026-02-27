import { Request, Response } from "express";
import { CronService } from "../services/cron.service";

const cronService = new CronService();

export const keepAlive = async (req: Request, res: Response) => {
  const success = await cronService.pingHuggingFace();

  if (success) {
    return res.status(200).json({ message: "HF backend is alive ✅" });
  } else {
    return res.status(500).json({ message: "HF backend ping failed ❌" });
  }
};

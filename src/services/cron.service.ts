import { ICronService } from "../interfaces/cron.interface";
import { CronRepository } from "../repositories/cron.repository";

export class CronService implements ICronService {
  private cronRepo: CronRepository;

  constructor() {
    this.cronRepo = new CronRepository();
  }

  async pingHuggingFace(): Promise<boolean> {
    return await this.cronRepo.pingHF();
  }
}

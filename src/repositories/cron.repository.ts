import axios from "axios";
import config from '../config/index';

export class CronRepository {
    async pingHF(): Promise<boolean> {
        try {
            await axios.get(config.HF_BACKEND_URL);
            return true;
        } catch (error) {
            console.error("HF Ping Failed:", error);
            return false;
        }

    }
}



import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface Config {
    NODE_ENV: string;
    PORT: number;
    API_PREFIX: string;
    MONGODB_URI: string;
    CLIENT_URL: string;
    LOG_LEVEL: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    SMTP_USER: string | undefined;
    SMTP_PASS: string | undefined;
    
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;

    HF_BACKEND_URL: string;
}


const config: Config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    SMTP_HOST: process.env.SMTP_HOST || 'smtp.example.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,

    JWT_SECRET: process.env.JWT_SECRET || "your_fallback_secret_that_should_be_changed",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_fallback_refresh_secret",

    HF_BACKEND_URL: process.env.HF_BACKEND_URL || "http://localhost:8000"
}

export default config;

// for production deployment on vercel
import "module-alias/register";

// for development environment variable support
// import 'tsconfig-paths/register';

import express, { Express } from 'express';
import cors from "cors";
import config from "./config/";
import { logger } from "./utils/logger";
import { connectDB } from "./config/db";
import { errorMiddleware } from './middlewares/error.middleware';

import routes from "./routes/index";
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// import routes from "./routes/index";


console.log("🚀 App starting...");

const app: Express = express();
const PORT = config.PORT || 8000;
const allowedOrigins = ["http://localhost:8080", "https://plant-health-hub.vercel.app/"];

// database connection
connectDB()

app.use(
    cors({
        // origin: config.CORS_ORIGIN,
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


// middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// API Routes
app.use(config.API_PREFIX, routes);

app.get("/", (req, res) => {
  res.json({ message: "backend is running" });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});



// Error handling middleware
app.use(errorMiddleware);

 // Start Server
try {
   
    app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${config.NODE_ENV} mode on port ${PORT}`);
      logger.info(
        `🔗 API Base URL: http://localhost:${PORT}${config.API_PREFIX}`
      );
    });
  } catch (err) {
    console.error("🔥 Failed to start the server:", err);
  
    // Exit with failure
    // process.exit(1);
  }



export default app;
import winston from "winston";
import config from "../config";

import fs from "fs";
import path from "path";



const { combine, timestamp, printf, colorize, errors } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let formattedMessage = `[${timestamp}] [${level}] : ${stack || message}`;

  if (Object.keys(meta).length) {
    formattedMessage += ` | meta: ${JSON.stringify(meta)}`;
  }

  return formattedMessage;
});





// Check environment
const isProduction = config.NODE_ENV === "production";
const logDir = path.resolve("logs");

// Create logs dir only in development
if (!isProduction && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Setup transports
const transports: winston.transport[] = [
  new winston.transports.Console(),
];

// Only use file transports in development
if (!isProduction) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    })
  );
}

const exceptionHandlers: winston.transport[] = [];

if (!isProduction) {
  exceptionHandlers.push(
    new winston.transports.File({ filename: path.join(logDir, "exceptions.log") })
  );
}










export const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    config.NODE_ENV === "development"
      ? colorize()
      : winston.format.uncolorize(),
    customFormat
  ),
  defaultMeta: { service: "plant-disease-api" },
  transports,
  exceptionHandlers,
});


// export const logger = winston.createLogger({
//   level: config.LOG_LEVEL || "info",
//   format: combine(
//     errors({ stack: true }),
//     timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     config.NODE_ENV === "development"
//       ? colorize()
//       : winston.format.uncolorize(),
//     customFormat
//   ),
//   defaultMeta: { service: "plant-disease-api" },
//   transports: [
//     new winston.transports.Console(),

//     new winston.transports.File({
//       filename: "logs/error.log",
//       level: "error",
//       maxsize: 10 * 1024 * 1024, // 10MB
//       maxFiles: 5,
//     }),
//     new winston.transports.File({
//       filename: "logs/combined.log",
//       maxsize: 10 * 1024 * 1024, // 10MB
//       maxFiles: 5,
//     }),
//   ],
//   exceptionHandlers: [
//     new winston.transports.File({ filename: "logs/exceptions.log" }),
//   ],
// });

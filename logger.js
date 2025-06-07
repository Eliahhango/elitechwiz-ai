import { createLogger as winstonCreateLogger, format, transports } from "winston"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { configuration } from "./config.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs")
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }
} catch (error) {
  console.error("Failed to create logs directory:", error)
}

// Create formatter
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.splat(),
  format.json(),
)

// Console formatter (more readable)
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`
  }),
)

/**
 * Creates a logger instance for a specific module
 * @param {string} module - The module name
 * @returns {winston.Logger} - The logger instance
 */
export function createLogger(module = "main") {
  const logger = winstonCreateLogger({
    level: process.env.LOG_LEVEL || configuration.logLevel,
    format: logFormat,
    defaultMeta: { service: "elitechwiz-ai", module },
    transports: [
      // Console transport
      new transports.Console({
        format: consoleFormat,
        level: "info",
      }),
    ],
    exitOnError: false,
  })

  // Add file transport if enabled and not in serverless environment
  const enableFileLogging = process.env.ENABLE_FILE_LOGGING !== "false"
  const isServerless = !!process.env.VERCEL || !!process.env.NETLIFY

  if (enableFileLogging && !isServerless) {
    logger.add(
      new transports.File({
        filename: path.join(logsDir, "error.log"),
        level: "error",
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
    )

    logger.add(
      new transports.File({
        filename: path.join(logsDir, "combined.log"),
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
    )
  }

  return logger
}

// Create default logger
const defaultLogger = createLogger("app")

// Export both the factory function and the default logger
export default defaultLogger

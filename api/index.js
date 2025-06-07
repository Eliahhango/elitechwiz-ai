import { createLogger } from "../logger.js"
import configManager from "../config-manager.js"

const logger = createLogger("main-api")

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  try {
    // Initialize config manager if not already done
    if (!configManager.initialized) {
      await configManager.initialize()
    }

    if (req.method === "GET") {
      // Health check endpoint
      return res.status(200).json({
        status: "running",
        bot: configManager.get("botName", "EliTechWiz AI"),
        timestamp: new Date().toISOString(),
        platform: "Vercel Serverless",
        version: "1.0.0",
      })
    }

    if (req.method === "POST") {
      // Handle webhook or other POST requests
      const { action, data } = req.body

      switch (action) {
        case "health":
          return res.status(200).json({
            success: true,
            status: "healthy",
            timestamp: new Date().toISOString(),
          })

        case "info":
          return res.status(200).json({
            success: true,
            info: {
              botName: configManager.get("botName", "EliTechWiz AI"),
              version: "1.0.0",
              platform: "Vercel Serverless",
              features: ["WhatsApp Integration", "AI Chat", "Configuration Management"],
            },
          })

        default:
          return res.status(400).json({
            error: "Invalid action",
            availableActions: ["health", "info"],
          })
      }
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (error) {
    logger.error("Main API Error:", error)
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

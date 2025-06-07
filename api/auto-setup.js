import { AutoConfigManager } from "../auto-config.js"
import { createLogger } from "../logger.js"

const logger = createLogger("auto-setup-api")

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  try {
    const autoConfig = new AutoConfigManager()

    switch (req.method) {
      case "GET":
        // Get setup status
        const status = await autoConfig.getSetupStatus()
        return res.status(200).json({
          success: true,
          status,
          message: status.setupCompleted ? "Setup already completed" : "Setup required",
        })

      case "POST":
        // Run auto-setup
        const { force = false } = req.body

        const currentStatus = await autoConfig.getSetupStatus()
        if (currentStatus.setupCompleted && !force) {
          return res.status(200).json({
            success: true,
            message: "Setup already completed",
            status: currentStatus,
          })
        }

        logger.info("🚀 Starting automatic setup...")
        const result = await autoConfig.autoSetup()

        return res.status(200).json({
          success: true,
          message: "Automatic setup completed successfully!",
          result,
          timestamp: new Date().toISOString(),
        })

      default:
        return res.status(405).json({
          error: "Method not allowed",
          allowedMethods: ["GET", "POST", "OPTIONS"],
        })
    }
  } catch (error) {
    logger.error("Auto-setup API error:", error)
    return res.status(500).json({
      success: false,
      error: "Auto-setup failed",
      message: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

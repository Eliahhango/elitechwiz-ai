import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import configManager from "./config-manager.js"
import { createLogger } from "./logger.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logger = createLogger("web-config")

/**
 * Initialize web configuration interface
 * @param {express.Application} app - Express application
 */
export function initWebConfig(app) {
  // Serve static files
  app.use("/config", express.static(path.join(__dirname, "public")))

  // API endpoints for configuration
  app.get("/api/config", async (req, res) => {
    try {
      // Check authentication
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const token = authHeader.split(" ")[1]
      const adminPasscode = configManager.getSecure("adminPasscode", "")

      if (!adminPasscode || token !== adminPasscode) {
        return res.status(401).json({ error: "Invalid token" })
      }

      // Return configuration (excluding secure data)
      const config = configManager.exportConfig()

      // Add API key status (but not the actual keys)
      const providers = configManager.getAvailableProviders()
      const apiKeyStatus = {}

      for (const provider of providers) {
        apiKeyStatus[provider] = !!configManager.getApiKey(provider)
      }

      res.json({
        config,
        apiKeyStatus,
      })
    } catch (error) {
      logger.error("Error getting configuration:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  })

  app.post("/api/config", express.json(), async (req, res) => {
    try {
      // Check authentication
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const token = authHeader.split(" ")[1]
      const adminPasscode = configManager.getSecure("adminPasscode", "")

      if (!adminPasscode || token !== adminPasscode) {
        return res.status(401).json({ error: "Invalid token" })
      }

      const { key, value, secure } = req.body

      if (!key) {
        return res.status(400).json({ error: "Missing key" })
      }

      if (value === undefined) {
        return res.status(400).json({ error: "Missing value" })
      }

      // Update configuration
      if (secure) {
        await configManager.setSecure(key, value)
      } else {
        await configManager.set(key, value)
      }

      res.json({ success: true })
    } catch (error) {
      logger.error("Error updating configuration:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  })

  app.post("/api/login", express.json(), async (req, res) => {
    try {
      const { passcode } = req.body

      if (!passcode) {
        return res.status(400).json({ error: "Missing passcode" })
      }

      const adminPasscode = configManager.getSecure("adminPasscode", "")

      if (!adminPasscode || passcode !== adminPasscode) {
        return res.status(401).json({ error: "Invalid passcode" })
      }

      res.json({
        token: adminPasscode,
        success: true,
      })
    } catch (error) {
      logger.error("Error during login:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  })

  logger.info("Web configuration interface initialized")
}

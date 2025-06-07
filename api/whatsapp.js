import {
  default as makeWASocket,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys"
import pino from "pino"
import { createLogger } from "../logger.js"

const logger = createLogger("whatsapp-api")

// Global variables for connection state
let sock = null
let connectionState = "disconnected"

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  try {
    if (req.method === "GET") {
      // Health check and status endpoint
      return res.status(200).json({
        status: "running",
        connection: connectionState,
        timestamp: new Date().toISOString(),
        platform: "Vercel Serverless",
      })
    }

    if (req.method === "POST") {
      const { action, data } = req.body

      switch (action) {
        case "connect":
          return await handleConnect(req, res, data)
        case "disconnect":
          return await handleDisconnect(req, res)
        case "send-message":
          return await handleSendMessage(req, res, data)
        case "get-pairing-code":
          return await handleGetPairingCode(req, res, data)
        default:
          return res.status(400).json({ error: "Invalid action" })
      }
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (error) {
    logger.error("API Error:", error)
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

async function handleConnect(req, res, data) {
  try {
    if (sock && connectionState === "connected") {
      return res.status(200).json({
        success: true,
        message: "Already connected",
        connectionState,
      })
    }

    // Initialize connection
    const { version } = await fetchLatestBaileysVersion()

    // For serverless, we'll use a simplified auth state
    const authState = {
      creds: {},
      keys: {},
    }

    sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      mobile: false,
      browser: ["EliTechWiz AI", "Chrome", "94.0.4606.81"],
      auth: {
        creds: authState.creds,
        keys: makeCacheableSignalKeyStore(authState.keys, pino({ level: "silent" })),
      },
    })

    connectionState = "connecting"

    return res.status(200).json({
      success: true,
      message: "Connection initiated",
      connectionState,
    })
  } catch (error) {
    logger.error("Connection error:", error)
    return res.status(500).json({
      error: "Failed to connect",
      message: error.message,
    })
  }
}

async function handleDisconnect(req, res) {
  try {
    if (sock) {
      await sock.logout()
      sock = null
    }
    connectionState = "disconnected"

    return res.status(200).json({
      success: true,
      message: "Disconnected successfully",
      connectionState,
    })
  } catch (error) {
    logger.error("Disconnect error:", error)
    return res.status(500).json({
      error: "Failed to disconnect",
      message: error.message,
    })
  }
}

async function handleSendMessage(req, res, data) {
  try {
    if (!sock || connectionState !== "connected") {
      return res.status(400).json({
        error: "Not connected to WhatsApp",
      })
    }

    const { to, message: messageText } = data

    if (!to || !messageText) {
      return res.status(400).json({
        error: "Missing required fields: to, message",
      })
    }

    await sock.sendMessage(to, { text: messageText })

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    logger.error("Send message error:", error)
    return res.status(500).json({
      error: "Failed to send message",
      message: error.message,
    })
  }
}

async function handleGetPairingCode(req, res, data) {
  try {
    const { phoneNumber } = data

    if (!phoneNumber) {
      return res.status(400).json({
        error: "Phone number is required",
      })
    }

    if (!sock) {
      return res.status(400).json({
        error: "WhatsApp socket not initialized",
      })
    }

    const code = await sock.requestPairingCode(phoneNumber)

    return res.status(200).json({
      success: true,
      pairingCode: code,
      phoneNumber,
    })
  } catch (error) {
    logger.error("Pairing code error:", error)
    return res.status(500).json({
      error: "Failed to generate pairing code",
      message: error.message,
    })
  }
}

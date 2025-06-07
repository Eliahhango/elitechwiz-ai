import dotenv from "dotenv"
dotenv.config()

export const configuration = {
  // WhatsApp Configuration
  usePairingCode: process.env.USE_PAIRING_CODE === "true" || false,
  phoneNumber: process.env.PHONE_NUMBER || "", // Your phone number for pairing code

  // AI Configuration
  aiProvider: process.env.AI_PROVIDER?.toLowerCase() || "openai",
  aiModel: process.env.AI_MODEL || "gpt-4o",

  // Server Configuration
  port: process.env.PORT || 3000,

  // Session Configuration
  sessionDir: process.env.SESSION_DIR || "./baileys_auth_info",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Bot Configuration
  botName: "EliTechWiz AI",
  maxContextLength: 10, // Maximum conversation context to keep
  typingDelayMin: 1000, // Minimum typing delay in ms
  typingDelayMax: 3000, // Maximum typing delay in ms
}

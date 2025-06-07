import { createLogger } from "../logger.js"

const logger = createLogger("env-validator")

/**
 * Validate environment variables
 * @returns {Object} Validation result
 */
export function validateEnvironment() {
  const errors = []
  const warnings = []

  // Required environment variables
  const required = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }

  // Optional but recommended environment variables
  const optional = {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    PHONE_NUMBER: process.env.PHONE_NUMBER,
    BOT_NAME: process.env.BOT_NAME,
    OWNER_NUMBER: process.env.OWNER_NUMBER,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  }

  // Check required variables
  for (const [key, value] of Object.entries(required)) {
    if (!value || value.trim() === "") {
      errors.push(`Missing required environment variable: ${key}`)
    }
  }

  // Check optional variables
  for (const [key, value] of Object.entries(optional)) {
    if (!value || value.trim() === "") {
      warnings.push(`Missing optional environment variable: ${key}`)
    }
  }

  // Validate API key format
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith("sk-")) {
    errors.push("OPENAI_API_KEY appears to be invalid (should start with 'sk-')")
  }

  // Validate phone number format if provided
  if (process.env.PHONE_NUMBER) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(process.env.PHONE_NUMBER.replace(/\D/g, ""))) {
      warnings.push("PHONE_NUMBER format may be invalid")
    }
  }

  const isValid = errors.length === 0

  if (!isValid) {
    logger.error("Environment validation failed:", errors)
  }

  if (warnings.length > 0) {
    logger.warn("Environment validation warnings:", warnings)
  }

  return {
    isValid,
    errors,
    warnings,
    summary: {
      required: Object.keys(required).length,
      requiredSet: Object.values(required).filter(Boolean).length,
      optional: Object.keys(optional).length,
      optionalSet: Object.values(optional).filter(Boolean).length,
    },
  }
}

/**
 * Get environment info for debugging
 * @returns {Object} Environment information
 */
export function getEnvironmentInfo() {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    environment: process.env.NODE_ENV || "development",
    vercel: !!process.env.VERCEL,
    vercelUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
  }
}

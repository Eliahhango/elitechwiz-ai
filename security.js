// security.js - Security management module for EliTechWiz AI
// This module provides security features including authorization, encryption, and configuration management

import fs from "fs/promises"
import path from "path"
import crypto from "crypto"
import { fileURLToPath } from "url"
import { createLogger } from "./logger.js"

const logger = createLogger("security")
const __dirname = path.dirname(fileURLToPath(import.meta.url))

class SecurityManager {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateEncryptionKey()
    this.authorizedUsers = new Set()
    this.rateLimits = new Map()
    this.blockedNumbers = new Set()
    this.adminNumbers = new Set()
    this.sessionTokens = new Map()
    this.failedAttempts = new Map()

    // Load security configuration
    this.loadSecurityConfig().catch((err) => {
      logger.error("Failed to load security config:", err)
    })
  }

  generateEncryptionKey() {
    return crypto.randomBytes(32).toString("hex")
  }

  async loadSecurityConfig() {
    try {
      const configPath = path.join(process.cwd(), "config", "security.json")

      try {
        const configData = await fs.readFile(configPath, "utf8")
        const config = JSON.parse(configData)

        this.blockedNumbers = new Set(config.blockedNumbers || [])
        this.adminNumbers = new Set(config.adminNumbers || [])
        this.authorizedUsers = new Set(config.authorizedUsers || [])

        logger.info("Security configuration loaded successfully")
      } catch (error) {
        if (error.code === "ENOENT") {
          logger.warn("Security config not found, creating default configuration")
          await this.createDefaultSecurityConfig()
        } else {
          throw error
        }
      }
    } catch (error) {
      logger.error("Error in loadSecurityConfig:", error)
      throw error
    }
  }

  async createDefaultSecurityConfig() {
    try {
      const configDir = path.join(process.cwd(), "config")
      await fs.mkdir(configDir, { recursive: true })

      const defaultConfig = {
        blockedNumbers: [],
        adminNumbers: process.env.ADMIN_NUMBERS ? process.env.ADMIN_NUMBERS.split(",") : [],
        authorizedUsers: [],
        rateLimits: {
          messagesPerMinute: Number.parseInt(process.env.RATE_LIMIT_PER_MINUTE) || 10,
          commandsPerHour: 50,
          maxConcurrentRequests: Number.parseInt(process.env.MAX_CONCURRENT_REQUESTS) || 5,
        },
        security: {
          encryptionEnabled: process.env.ENCRYPTION_ENABLED === "true",
          sensitiveDataMasking: process.env.SENSITIVE_DATA_MASKING === "true",
          maxFailedAttempts: 5,
          lockoutDuration: 300000, // 5 minutes
          sessionTimeout: 3600000, // 1 hour
          requireAuthentication: true,
        },
      }

      await fs.writeFile(path.join(configDir, "security.json"), JSON.stringify(defaultConfig, null, 2))

      logger.info("Default security configuration created")
    } catch (error) {
      logger.error("Failed to create security config:", error)
      throw error
    }
  }

  // Main authorization function - REQUIRED EXPORT
  isAuthorized(phoneNumber, action = "message") {
    try {
      // Remove country code formatting for consistency
      const cleanNumber = this.cleanPhoneNumber(phoneNumber)

      // Check if number is blocked
      if (this.isBlocked(cleanNumber)) {
        logger.warn(`Blocked number attempted access: ${cleanNumber}`)
        return false
      }

      // Check rate limits
      if (!this.checkRateLimit(cleanNumber, action)) {
        logger.warn(`Rate limit exceeded for: ${cleanNumber}`)
        return false
      }

      // Check if user is locked out due to failed attempts
      if (this.isLockedOut(cleanNumber)) {
        logger.warn(`Locked out user attempted access: ${cleanNumber}`)
        return false
      }

      // Admin numbers have full access
      if (this.isAdmin(cleanNumber)) {
        logger.info(`Admin access granted: ${cleanNumber}`)
        return true
      }

      // Check if user is explicitly authorized
      if (this.authorizedUsers.has(cleanNumber)) {
        logger.info(`Authorized user access granted: ${cleanNumber}`)
        return true
      }

      // For public mode, allow all non-blocked users
      if (process.env.BOT_MODE === "public") {
        logger.info(`Public mode access granted: ${cleanNumber}`)
        return true
      }

      // For private mode, only authorized users
      if (process.env.BOT_MODE === "private") {
        logger.warn(`Unauthorized access attempt in private mode: ${cleanNumber}`)
        return false
      }

      // Default behavior - allow access but log it
      logger.info(`Default access granted: ${cleanNumber}`)
      return true
    } catch (error) {
      logger.error("Authorization check failed:", error)
      return false
    }
  }

  // Reset configuration function - REQUIRED EXPORT
  async resetConfiguration() {
    try {
      logger.info("Resetting security configuration...")

      // Clear in-memory data
      this.authorizedUsers.clear()
      this.rateLimits.clear()
      this.blockedNumbers.clear()
      this.adminNumbers.clear()
      this.sessionTokens.clear()
      this.failedAttempts.clear()

      // Remove existing config files
      const configDir = path.join(process.cwd(), "config")
      const securityConfigPath = path.join(configDir, "security.json")

      try {
        await fs.unlink(securityConfigPath)
        logger.info("Existing security config removed")
      } catch (error) {
        // File might not exist, which is fine
        logger.debug("No existing security config to remove")
      }

      // Recreate default configuration
      await this.createDefaultSecurityConfig()
      await this.loadSecurityConfig()

      logger.info("Security configuration reset successfully")
      return {
        success: true,
        message: "Security configuration has been reset to defaults",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      logger.error("Failed to reset security configuration:", error)
      return {
        success: false,
        message: "Failed to reset security configuration",
        error: error.message,
        timestamp: new Date().toISOString(),
      }
    }
  }

  // Helper methods
  cleanPhoneNumber(phoneNumber) {
    if (!phoneNumber) return ""
    return phoneNumber.toString().replace(/\D/g, "").replace(/^1/, "")
  }

  isBlocked(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    return this.blockedNumbers.has(cleanNumber)
  }

  isAdmin(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    return this.adminNumbers.has(cleanNumber)
  }

  checkRateLimit(phoneNumber, action) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    const now = Date.now()
    const key = `${cleanNumber}:${action}`

    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, { count: 1, resetTime: now + 60000 })
      return true
    }

    const limit = this.rateLimits.get(key)

    if (now > limit.resetTime) {
      // Reset the limit
      this.rateLimits.set(key, { count: 1, resetTime: now + 60000 })
      return true
    }

    const maxRequests = action === "command" ? 20 : 10
    if (limit.count >= maxRequests) {
      return false
    }

    limit.count++
    return true
  }

  isLockedOut(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    const attempts = this.failedAttempts.get(cleanNumber)

    if (!attempts) return false

    const now = Date.now()
    if (now > attempts.lockoutUntil) {
      // Lockout period has expired
      this.failedAttempts.delete(cleanNumber)
      return false
    }

    return attempts.count >= 5
  }

  recordFailedAttempt(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    const now = Date.now()
    const attempts = this.failedAttempts.get(cleanNumber) || { count: 0, lockoutUntil: 0 }

    attempts.count++

    if (attempts.count >= 5) {
      attempts.lockoutUntil = now + 300000 // 5 minutes lockout
      logger.warn(`User locked out due to failed attempts: ${cleanNumber}`)
    }

    this.failedAttempts.set(cleanNumber, attempts)
  }

  clearFailedAttempts(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    this.failedAttempts.delete(cleanNumber)
  }

  addAuthorizedUser(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    this.authorizedUsers.add(cleanNumber)
    logger.info(`User authorized: ${cleanNumber}`)
  }

  removeAuthorizedUser(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    this.authorizedUsers.delete(cleanNumber)
    logger.info(`User authorization revoked: ${cleanNumber}`)
  }

  blockUser(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    this.blockedNumbers.add(cleanNumber)
    this.authorizedUsers.delete(cleanNumber)
    logger.info(`User blocked: ${cleanNumber}`)
  }

  unblockUser(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    this.blockedNumbers.delete(cleanNumber)
    logger.info(`User unblocked: ${cleanNumber}`)
  }

  generateSessionToken(phoneNumber) {
    const cleanNumber = this.cleanPhoneNumber(phoneNumber)
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = Date.now() + 3600000 // 1 hour

    this.sessionTokens.set(token, {
      phoneNumber: cleanNumber,
      expiresAt,
      createdAt: Date.now(),
    })

    return token
  }

  validateSessionToken(token) {
    const session = this.sessionTokens.get(token)

    if (!session) return null

    if (Date.now() > session.expiresAt) {
      this.sessionTokens.delete(token)
      return null
    }

    return session
  }

  encrypt(text) {
    if (!process.env.ENCRYPTION_ENABLED === "true") return text

    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(this.encryptionKey.slice(0, 32)), iv)

      let encrypted = cipher.update(text, "utf8", "hex")
      encrypted += cipher.final("hex")

      return iv.toString("hex") + ":" + encrypted
    } catch (error) {
      logger.error("Encryption failed:", error)
      return text
    }
  }

  decrypt(encryptedText) {
    if (!process.env.ENCRYPTION_ENABLED === "true") return encryptedText

    try {
      const parts = encryptedText.split(":")
      if (parts.length !== 2) return encryptedText

      const iv = Buffer.from(parts[0], "hex")
      const encrypted = parts[1]

      const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(this.encryptionKey.slice(0, 32)), iv)

      let decrypted = decipher.update(encrypted, "hex", "utf8")
      decrypted += decipher.final("utf8")

      return decrypted
    } catch (error) {
      logger.error("Decryption failed:", error)
      return encryptedText
    }
  }

  maskSensitiveData(data) {
    if (!process.env.SENSITIVE_DATA_MASKING === "true") return data

    const sensitivePatterns = [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      /\b\d{10,15}\b/g, // Phone numbers
    ]

    let maskedData = data
    sensitivePatterns.forEach((pattern) => {
      maskedData = maskedData.replace(pattern, "***MASKED***")
    })

    return maskedData
  }

  getSecurityStats() {
    return {
      authorizedUsers: this.authorizedUsers.size,
      blockedNumbers: this.blockedNumbers.size,
      adminNumbers: this.adminNumbers.size,
      activeRateLimits: this.rateLimits.size,
      activeSessions: this.sessionTokens.size,
      failedAttempts: this.failedAttempts.size,
      encryptionEnabled: process.env.ENCRYPTION_ENABLED === "true",
      sensitiveDataMasking: process.env.SENSITIVE_DATA_MASKING === "true",
    }
  }

  async saveSecurityConfig() {
    try {
      const configDir = path.join(process.cwd(), "config")
      await fs.mkdir(configDir, { recursive: true })

      const config = {
        blockedNumbers: Array.from(this.blockedNumbers),
        adminNumbers: Array.from(this.adminNumbers),
        authorizedUsers: Array.from(this.authorizedUsers),
        lastUpdated: new Date().toISOString(),
      }

      await fs.writeFile(path.join(configDir, "security.json"), JSON.stringify(config, null, 2))

      logger.info("Security configuration saved")
    } catch (error) {
      logger.error("Failed to save security config:", error)
      throw error
    }
  }
}

// Create singleton instance
const securityManager = new SecurityManager()

// Export the required functions and the manager
export const isAuthorized = (phoneNumber, action) => securityManager.isAuthorized(phoneNumber, action)
export const resetConfiguration = () => securityManager.resetConfiguration()
export const blockUser = (phoneNumber) => securityManager.blockUser(phoneNumber)
export const unblockUser = (phoneNumber) => securityManager.unblockUser(phoneNumber)
export const addAuthorizedUser = (phoneNumber) => securityManager.addAuthorizedUser(phoneNumber)
export const removeAuthorizedUser = (phoneNumber) => securityManager.removeAuthorizedUser(phoneNumber)
export const isAdmin = (phoneNumber) => securityManager.isAdmin(phoneNumber)
export const isBlocked = (phoneNumber) => securityManager.isBlocked(phoneNumber)
export const checkRateLimit = (phoneNumber, action) => securityManager.checkRateLimit(phoneNumber, action)
export const recordFailedAttempt = (phoneNumber) => securityManager.recordFailedAttempt(phoneNumber)
export const clearFailedAttempts = (phoneNumber) => securityManager.clearFailedAttempts(phoneNumber)
export const generateSessionToken = (phoneNumber) => securityManager.generateSessionToken(phoneNumber)
export const validateSessionToken = (token) => securityManager.validateSessionToken(token)
export const encrypt = (text) => securityManager.encrypt(text)
export const decrypt = (text) => securityManager.decrypt(text)
export const maskSensitiveData = (data) => securityManager.maskSensitiveData(data)
export const getSecurityStats = () => securityManager.getSecurityStats()
export const saveSecurityConfig = () => securityManager.saveSecurityConfig()

// Export the manager itself
export { SecurityManager, securityManager }

// For CommonJS compatibility
export default {
  isAuthorized,
  resetConfiguration,
  blockUser,
  unblockUser,
  addAuthorizedUser,
  removeAuthorizedUser,
  isAdmin,
  isBlocked,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  generateSessionToken,
  validateSessionToken,
  encrypt,
  decrypt,
  maskSensitiveData,
  getSecurityStats,
  saveSecurityConfig,
  SecurityManager,
  securityManager,
}

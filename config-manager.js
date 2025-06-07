import fs from "fs/promises"
import path from "path"
import crypto from "crypto"
import dotenv from "dotenv"
import { createLogger } from "./logger.js"

// Initialize logger
const logger = createLogger("config-manager")

// Default configuration paths
const CONFIG_DIR = process.env.CONFIG_DIR || "./config"
const CONFIG_FILE = path.join(CONFIG_DIR, "bot-config.json")
const SECURE_CONFIG_FILE = path.join(CONFIG_DIR, "secure-config.enc")
const ENV_FILE = ".env"

// Default configuration
const DEFAULT_CONFIG = {
  // Bot settings
  botName: "EliTechWiz AI",
  botMode: "private", // 'private' or 'public'

  // AI model settings
  aiProvider: "openai",
  aiModel: "gpt-4o",

  // Owner information
  ownerNumber: "", // WhatsApp number of the bot owner

  // Session settings
  sessionDir: "./baileys_auth_info",
  usePairingCode: false, // Use pairing code instead of QR code
  phoneNumber: "", // Phone number for pairing code

  // Logging settings
  logLevel: "info",

  // Command settings
  commandPrefix: "/",

  // Conversation settings
  maxContextLength: 10, // Maximum conversation context to keep

  // Typing simulation settings
  typingDelayMin: 1000, // Minimum typing delay in ms
  typingDelayMax: 3000, // Maximum typing delay in ms

  // Allowed models by provider
  allowedModels: {
    openai: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
    anthropic: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
    gemini: ["gemini-pro", "gemini-ultra"],
    mistral: ["mistral-large", "mistral-medium", "mistral-small"],
  },
}

// Secure configuration (will be encrypted)
const DEFAULT_SECURE_CONFIG = {
  apiKeys: {
    openai: "",
    anthropic: "",
    gemini: "",
    mistral: "",
  },
  webhookSecret: "",
  adminPasscode: "", // For admin authentication
}

/**
 * Configuration Manager class
 * Handles loading, saving, and managing bot configuration
 */
class ConfigManager {
  constructor() {
    this.config = { ...DEFAULT_CONFIG }
    this.secureConfig = { ...DEFAULT_SECURE_CONFIG }
    this.encryptionKey = null
    this.initialized = false
  }

  /**
   * Initialize the configuration manager
   * @param {string} encryptionKey - Key to encrypt/decrypt secure config
   */
  async initialize(encryptionKey = process.env.ENCRYPTION_KEY) {
    try {
      // Create config directory if it doesn't exist
      await fs.mkdir(CONFIG_DIR, { recursive: true })

      // Set encryption key
      this.encryptionKey = encryptionKey || (await this.generateEncryptionKey())

      // Load configuration
      await this.loadConfig()
      await this.loadSecureConfig()

      // Load environment variables
      dotenv.config()

      // Override config with environment variables
      this.loadFromEnv()

      this.initialized = true
      logger.info("Configuration manager initialized successfully")
    } catch (error) {
      logger.error("Failed to initialize configuration manager:", error)
      throw error
    }
  }

  /**
   * Generate a new encryption key
   * @returns {string} - Generated encryption key
   */
  async generateEncryptionKey() {
    const key = crypto.randomBytes(32).toString("hex")

    // Save to .env file if it doesn't exist
    try {
      let envContent = ""
      try {
        envContent = await fs.readFile(ENV_FILE, "utf8")
      } catch (error) {
        // File doesn't exist, create it
      }

      if (!envContent.includes("ENCRYPTION_KEY=")) {
        await fs.appendFile(ENV_FILE, `\nENCRYPTION_KEY=${key}\n`)
        logger.info("Generated new encryption key and saved to .env file")
      }
    } catch (error) {
      logger.error("Failed to save encryption key to .env file:", error)
    }

    return key
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(CONFIG_FILE, "utf8")
      this.config = { ...DEFAULT_CONFIG, ...JSON.parse(configData) }
      logger.info("Configuration loaded successfully")
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, create it with default config
        await this.saveConfig()
        logger.info("Created new configuration file with default settings")
      } else {
        logger.error("Failed to load configuration:", error)
        throw error
      }
    }
  }

  /**
   * Load secure configuration from encrypted file
   */
  async loadSecureConfig() {
    try {
      const encryptedData = await fs.readFile(SECURE_CONFIG_FILE)
      const decrypted = this.decrypt(encryptedData)
      this.secureConfig = { ...DEFAULT_SECURE_CONFIG, ...JSON.parse(decrypted) }
      logger.info("Secure configuration loaded successfully")
    } catch (error) {
      if (error.code === "ENOENT") {
        // File doesn't exist, create it with default secure config
        await this.saveSecureConfig()
        logger.info("Created new secure configuration file with default settings")
      } else {
        logger.error("Failed to load secure configuration:", error)
        throw error
      }
    }
  }

  /**
   * Save configuration to file
   */
  async saveConfig() {
    try {
      await fs.writeFile(CONFIG_FILE, JSON.stringify(this.config, null, 2))
      logger.info("Configuration saved successfully")
    } catch (error) {
      logger.error("Failed to save configuration:", error)
      throw error
    }
  }

  /**
   * Save secure configuration to encrypted file
   */
  async saveSecureConfig() {
    try {
      const data = JSON.stringify(this.secureConfig)
      const encrypted = this.encrypt(data)
      await fs.writeFile(SECURE_CONFIG_FILE, encrypted)
      logger.info("Secure configuration saved successfully")
    } catch (error) {
      logger.error("Failed to save secure configuration:", error)
      throw error
    }
  }

  /**
   * Encrypt data using the encryption key
   * @param {string} data - Data to encrypt
   * @returns {Buffer} - Encrypted data
   */
  encrypt(data) {
    if (!this.encryptionKey) {
      throw new Error("Encryption key not set")
    }

    const iv = crypto.randomBytes(16)
    const key = crypto.createHash("sha256").update(this.encryptionKey).digest("base64").substring(0, 32)
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)

    let encrypted = cipher.update(data, "utf8", "hex")
    encrypted += cipher.final("hex")

    return Buffer.from(iv.toString("hex") + encrypted, "hex")
  }

  /**
   * Decrypt data using the encryption key
   * @param {Buffer} encryptedData - Encrypted data
   * @returns {string} - Decrypted data
   */
  decrypt(encryptedData) {
    if (!this.encryptionKey) {
      throw new Error("Encryption key not set")
    }

    const encryptedText = encryptedData.toString("hex")
    const iv = Buffer.from(encryptedText.substring(0, 32), "hex")
    const encrypted = encryptedText.substring(32)
    const key = crypto.createHash("sha256").update(this.encryptionKey).digest("base64").substring(0, 32)
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  }

  /**
   * Load configuration from environment variables
   */
  loadFromEnv() {
    // Bot settings
    if (process.env.BOT_NAME) this.config.botName = process.env.BOT_NAME
    if (process.env.BOT_MODE) this.config.botMode = process.env.BOT_MODE

    // AI model settings
    if (process.env.AI_PROVIDER) this.config.aiProvider = process.env.AI_PROVIDER
    if (process.env.AI_MODEL) this.config.aiModel = process.env.AI_MODEL

    // Owner information
    if (process.env.OWNER_NUMBER) this.config.ownerNumber = process.env.OWNER_NUMBER

    // Session settings
    if (process.env.SESSION_DIR) this.config.sessionDir = process.env.SESSION_DIR

    // Logging settings
    if (process.env.LOG_LEVEL) this.config.logLevel = process.env.LOG_LEVEL

    // Command settings
    if (process.env.COMMAND_PREFIX) this.config.commandPrefix = process.env.COMMAND_PREFIX

    // API keys (secure)
    if (process.env.OPENAI_API_KEY) this.secureConfig.apiKeys.openai = process.env.OPENAI_API_KEY
    if (process.env.ANTHROPIC_API_KEY) this.secureConfig.apiKeys.anthropic = process.env.ANTHROPIC_API_KEY
    if (process.env.GEMINI_API_KEY) this.secureConfig.apiKeys.gemini = process.env.GEMINI_API_KEY
    if (process.env.MISTRAL_API_KEY) this.secureConfig.apiKeys.mistral = process.env.MISTRAL_API_KEY

    // Other secure settings
    if (process.env.WEBHOOK_SECRET) this.secureConfig.webhookSecret = process.env.WEBHOOK_SECRET
    if (process.env.ADMIN_PASSCODE) this.secureConfig.adminPasscode = process.env.ADMIN_PASSCODE

    logger.info("Configuration loaded from environment variables")
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Configuration value
   */
  get(key, defaultValue = null) {
    const keys = key.split(".")
    let value = this.config

    for (const k of keys) {
      if (value === undefined || value === null) return defaultValue
      value = value[k]
    }

    return value !== undefined ? value : defaultValue
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key
   * @param {*} value - Configuration value
   */
  async set(key, value) {
    const keys = key.split(".")
    const lastKey = keys.pop()
    let obj = this.config

    for (const k of keys) {
      if (!obj[k]) obj[k] = {}
      obj = obj[k]
    }

    obj[lastKey] = value
    await this.saveConfig()
  }

  /**
   * Get secure configuration value
   * @param {string} key - Secure configuration key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Secure configuration value
   */
  getSecure(key, defaultValue = null) {
    const keys = key.split(".")
    let value = this.secureConfig

    for (const k of keys) {
      if (value === undefined || value === null) return defaultValue
      value = value[k]
    }

    return value !== undefined ? value : defaultValue
  }

  /**
   * Set secure configuration value
   * @param {string} key - Secure configuration key
   * @param {*} value - Secure configuration value
   */
  async setSecure(key, value) {
    const keys = key.split(".")
    const lastKey = keys.pop()
    let obj = this.secureConfig

    for (const k of keys) {
      if (!obj[k]) obj[k] = {}
      obj = obj[k]
    }

    obj[lastKey] = value
    await this.saveSecureConfig()
  }

  /**
   * Get API key for the specified provider
   * @param {string} provider - AI provider name
   * @returns {string} - API key
   */
  getApiKey(provider) {
    return this.getSecure(`apiKeys.${provider}`, "")
  }

  /**
   * Set API key for the specified provider
   * @param {string} provider - AI provider name
   * @param {string} apiKey - API key
   */
  async setApiKey(provider, apiKey) {
    await this.setSecure(`apiKeys.${provider}`, apiKey)
  }

  /**
   * Check if the current AI model is valid
   * @returns {boolean} - True if valid, false otherwise
   */
  isValidModel() {
    const provider = this.get("aiProvider")
    const model = this.get("aiModel")
    const allowedModels = this.get(`allowedModels.${provider}`, [])

    return allowedModels.includes(model)
  }

  /**
   * Get all available AI providers
   * @returns {string[]} - List of available providers
   */
  getAvailableProviders() {
    return Object.keys(this.get("allowedModels", {}))
  }

  /**
   * Get all available AI models for the specified provider
   * @param {string} provider - AI provider name
   * @returns {string[]} - List of available models
   */
  getAvailableModels(provider) {
    return this.get(`allowedModels.${provider}`, [])
  }

  /**
   * Check if the user is the bot owner
   * @param {string} number - WhatsApp number to check
   * @returns {boolean} - True if owner, false otherwise
   */
  isOwner(number) {
    const ownerNumber = this.get("ownerNumber", "")
    return ownerNumber === number
  }

  /**
   * Validate admin passcode
   * @param {string} passcode - Passcode to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  validateAdminPasscode(passcode) {
    const storedPasscode = this.getSecure("adminPasscode", "")
    return storedPasscode === passcode
  }

  /**
   * Export configuration as object (excluding secure data)
   * @returns {object} - Configuration object
   */
  exportConfig() {
    return { ...this.config }
  }
}

// Create and export singleton instance
const configManager = new ConfigManager()
export default configManager

const fs = require("fs").promises
const path = require("path")
const crypto = require("crypto")
const { createLogger } = require("./logger")

const logger = createLogger("auto-config")

class AutoConfigManager {
  constructor() {
    this.configPath = path.join(process.cwd(), ".env")
    this.backupPath = path.join(process.cwd(), ".env.backup")
    this.defaultConfig = this.getDefaultConfiguration()
  }

  getDefaultConfiguration() {
    return {
      // Core Settings (Auto-generated)
      NODE_ENV: "production",
      PORT: "3000",

      // Bot Configuration (Smart defaults)
      BOT_NAME: "EliTechWiz AI",
      BOT_MODE: "private",
      BOT_PERSONALITY: "helpful",
      BOT_LANGUAGE: "en",
      BOT_TIMEZONE: "UTC",
      BOT_CUSTOM_PROMPT: "",
      COMMAND_PREFIX: "/",

      // AI Configuration (Best defaults)
      AI_PROVIDER: "openai",
      AI_MODEL: "gpt-4o",
      AI_MAX_TOKENS: "4096",
      AI_TEMPERATURE: "0.7",
      AI_TOP_P: "1.0",
      AI_FREQUENCY_PENALTY: "0.0",
      AI_PRESENCE_PENALTY: "0.0",

      // WhatsApp Configuration (Optimized)
      USE_PAIRING_CODE: "true",
      SESSION_DIR: "./baileys_auth_info",
      SESSION_PATH: "./baileys_auth_info",
      AUTO_RECONNECT: "true",
      MARK_ONLINE_ON_CONNECT: "true",
      PRINT_QR_IN_TERMINAL: "true",

      // Security Configuration (Enterprise-grade)
      ENCRYPTION_ENABLED: "true",
      ENCRYPTION_KEY: this.generateSecureKey(64),
      SENSITIVE_DATA_MASKING: "true",
      RATE_LIMIT_PER_MINUTE: "60",
      MAX_MESSAGE_LENGTH: "4000",
      MAX_CONCURRENT_REQUESTS: "10",
      REQUEST_TIMEOUT: "30000",
      RETRY_ATTEMPTS: "3",
      RETRY_DELAY: "1000",

      // Features Configuration (All enabled by default)
      ENABLE_ANALYTICS: "true",
      ENABLE_PLUGINS: "true",
      ENABLE_WEBHOOKS: "true",
      ENABLE_SCHEDULER: "true",
      ENABLE_MEDIA_AI: "true",
      ENABLE_VOICE: "true",
      ENABLE_GROUP_MANAGEMENT: "true",
      ENABLE_AUTO_RESPONSES: "true",
      ENABLE_SECURITY: "true",
      ENABLE_RATE_LIMIT: "true",
      ENABLE_LOGGING: "true",
      ENABLE_MONITORING: "true",

      // Performance Configuration (Optimized)
      CACHE_ENABLED: "true",
      CACHE_TTL: "300",

      // Logging Configuration (Comprehensive)
      LOG_LEVEL: "info",
      ENABLE_FILE_LOGGING: "true",
      ENABLE_CONSOLE_LOGGING: "true",
      LOG_RETENTION_DAYS: "7",

      // Webhook Configuration (Ready to use)
      WEBHOOKS_ENABLED: "false",
      WEBHOOK_EVENTS: "message,status,connection",
      WEBHOOK_RETRY_ATTEMPTS: "3",
      WEBHOOK_TIMEOUT: "5000",

      // Database Configuration (SQLite by default)
      DATABASE_ENABLED: "true",
      DATABASE_TYPE: "sqlite",
      DATABASE_URL: "sqlite:./data/bot.db",
      DATABASE_MAX_CONNECTIONS: "10",
      DATABASE_CONNECTION_TIMEOUT: "5000",

      // Platform Detection (Auto-detected)
      CONFIG_DIR: "./config",
      ADMIN_PASSCODE: this.generateSecureKey(16),
      WEBHOOK_SECRET: this.generateSecureKey(32),

      // Auto-generated IDs
      BOT_ID: this.generateBotId(),
      INSTANCE_ID: this.generateInstanceId(),
      SETUP_VERSION: "2.0.0",
      SETUP_TIMESTAMP: new Date().toISOString(),
    }
  }

  generateSecureKey(length = 32) {
    return crypto.randomBytes(length).toString("hex")
  }

  generateBotId() {
    return `elitechwiz_${crypto.randomBytes(8).toString("hex")}`
  }

  generateInstanceId() {
    return `instance_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`
  }

  async autoSetup() {
    try {
      logger.info("🚀 Starting automatic configuration setup...")

      // Step 1: Backup existing .env if it exists
      await this.backupExistingConfig()

      // Step 2: Detect platform and adjust config
      const platformConfig = await this.detectPlatformConfig()

      // Step 3: Merge configurations
      const finalConfig = { ...this.defaultConfig, ...platformConfig }

      // Step 4: Create .env file
      await this.createEnvFile(finalConfig)

      // Step 5: Create additional config files
      await this.createAdditionalConfigs()

      // Step 6: Set up directories
      await this.setupDirectories()

      // Step 7: Initialize database
      await this.initializeDatabase()

      logger.info("✅ Automatic configuration completed successfully!")

      return {
        success: true,
        message: "Configuration setup completed automatically",
        config: this.maskSensitiveValues(finalConfig),
        setupTime: new Date().toISOString(),
      }
    } catch (error) {
      logger.error("❌ Auto-setup failed:", error)
      throw error
    }
  }

  async backupExistingConfig() {
    try {
      const exists = await fs
        .access(this.configPath)
        .then(() => true)
        .catch(() => false)

      if (exists) {
        const content = await fs.readFile(this.configPath, "utf8")
        await fs.writeFile(this.backupPath, content)
        logger.info("📋 Existing .env backed up")
      }
    } catch (error) {
      logger.warn("Could not backup existing config:", error.message)
    }
  }

  async detectPlatformConfig() {
    const platformConfig = {}

    // Detect deployment platform
    if (process.env.VERCEL) {
      platformConfig.PLATFORM = "vercel"
      platformConfig.VERCEL = "true"
      platformConfig.DATABASE_TYPE = "postgresql" // Vercel works better with PostgreSQL
    } else if (process.env.NETLIFY) {
      platformConfig.PLATFORM = "netlify"
      platformConfig.NETLIFY = "true"
    } else if (process.env.DYNO) {
      platformConfig.PLATFORM = "heroku"
      platformConfig.DYNO = "true"
    } else if (process.env.RAILWAY_ENVIRONMENT) {
      platformConfig.PLATFORM = "railway"
      platformConfig.RAILWAY_ENVIRONMENT = "true"
    } else if (process.env.RENDER) {
      platformConfig.PLATFORM = "render"
      platformConfig.RENDER = "true"
    } else {
      platformConfig.PLATFORM = "local"
    }

    // Auto-detect Git information
    if (process.env.VERCEL_GIT_PROVIDER) {
      platformConfig.VERCEL_GIT_PROVIDER = process.env.VERCEL_GIT_PROVIDER
      platformConfig.GIT_PROVIDER = process.env.VERCEL_GIT_PROVIDER
    }

    if (process.env.VERCEL_GIT_REPO_OWNER) {
      platformConfig.VERCEL_GIT_REPO_OWNER = process.env.VERCEL_GIT_REPO_OWNER
      platformConfig.GIT_OWNER = process.env.VERCEL_GIT_REPO_OWNER
    }

    if (process.env.VERCEL_GIT_REPO_SLUG) {
      platformConfig.VERCEL_GIT_REPO_SLUG = process.env.VERCEL_GIT_REPO_SLUG
      platformConfig.GIT_REPO = process.env.VERCEL_GIT_REPO_SLUG
    }

    // Set platform-specific optimizations
    if (platformConfig.PLATFORM === "vercel") {
      platformConfig.ENABLE_FILE_LOGGING = "false" // Vercel doesn't support file system
      platformConfig.SESSION_DIR = "/tmp/baileys_auth_info"
      platformConfig.DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost/elitechwiz"
    }

    logger.info(`🔍 Detected platform: ${platformConfig.PLATFORM}`)
    return platformConfig
  }

  async createEnvFile(config) {
    try {
      let envContent = "# EliTechWiz AI - Auto-Generated Configuration\n"
      envContent += `# Generated on: ${new Date().toISOString()}\n`
      envContent += "# DO NOT EDIT MANUALLY - Use the web interface to modify settings\n\n"

      // Group configurations by category
      const categories = {
        "# === CORE CONFIGURATION ===": [
          "NODE_ENV",
          "PORT",
          "PLATFORM",
          "BOT_ID",
          "INSTANCE_ID",
          "SETUP_VERSION",
          "SETUP_TIMESTAMP",
        ],
        "# === BOT SETTINGS ===": [
          "BOT_NAME",
          "BOT_MODE",
          "BOT_PERSONALITY",
          "BOT_LANGUAGE",
          "BOT_TIMEZONE",
          "BOT_CUSTOM_PROMPT",
          "COMMAND_PREFIX",
        ],
        "# === AI CONFIGURATION ===": [
          "AI_PROVIDER",
          "AI_MODEL",
          "AI_MAX_TOKENS",
          "AI_TEMPERATURE",
          "AI_TOP_P",
          "AI_FREQUENCY_PENALTY",
          "AI_PRESENCE_PENALTY",
        ],
        "# === WHATSAPP SETTINGS ===": [
          "USE_PAIRING_CODE",
          "SESSION_DIR",
          "SESSION_PATH",
          "AUTO_RECONNECT",
          "MARK_ONLINE_ON_CONNECT",
          "PRINT_QR_IN_TERMINAL",
        ],
        "# === SECURITY CONFIGURATION ===": [
          "ENCRYPTION_ENABLED",
          "ENCRYPTION_KEY",
          "SENSITIVE_DATA_MASKING",
          "RATE_LIMIT_PER_MINUTE",
          "MAX_MESSAGE_LENGTH",
          "MAX_CONCURRENT_REQUESTS",
          "REQUEST_TIMEOUT",
          "RETRY_ATTEMPTS",
          "RETRY_DELAY",
          "ADMIN_PASSCODE",
        ],
        "# === FEATURES (ALL ENABLED) ===": [
          "ENABLE_ANALYTICS",
          "ENABLE_PLUGINS",
          "ENABLE_WEBHOOKS",
          "ENABLE_SCHEDULER",
          "ENABLE_MEDIA_AI",
          "ENABLE_VOICE",
          "ENABLE_GROUP_MANAGEMENT",
          "ENABLE_AUTO_RESPONSES",
          "ENABLE_SECURITY",
          "ENABLE_RATE_LIMIT",
          "ENABLE_LOGGING",
          "ENABLE_MONITORING",
        ],
        "# === PERFORMANCE SETTINGS ===": ["CACHE_ENABLED", "CACHE_TTL"],
        "# === LOGGING CONFIGURATION ===": [
          "LOG_LEVEL",
          "ENABLE_FILE_LOGGING",
          "ENABLE_CONSOLE_LOGGING",
          "LOG_RETENTION_DAYS",
        ],
        "# === WEBHOOK SETTINGS ===": [
          "WEBHOOKS_ENABLED",
          "WEBHOOK_EVENTS",
          "WEBHOOK_RETRY_ATTEMPTS",
          "WEBHOOK_TIMEOUT",
          "WEBHOOK_SECRET",
        ],
        "# === DATABASE CONFIGURATION ===": [
          "DATABASE_ENABLED",
          "DATABASE_TYPE",
          "DATABASE_URL",
          "DATABASE_MAX_CONNECTIONS",
          "DATABASE_CONNECTION_TIMEOUT",
        ],
        "# === PLATFORM DETECTION ===": [
          "CONFIG_DIR",
          "VERCEL",
          "NETLIFY",
          "DYNO",
          "RAILWAY_ENVIRONMENT",
          "RENDER",
          "VERCEL_GIT_PROVIDER",
          "VERCEL_GIT_REPO_OWNER",
          "VERCEL_GIT_REPO_SLUG",
          "GIT_PROVIDER",
          "GIT_OWNER",
          "GIT_REPO",
        ],
      }

      for (const [category, keys] of Object.entries(categories)) {
        envContent += `\n${category}\n`
        for (const key of keys) {
          if (config[key] !== undefined) {
            envContent += `${key}=${config[key]}\n`
          }
        }
      }

      // Add placeholder for API keys
      envContent += "\n# === API KEYS (ADD YOUR KEYS HERE) ===\n"
      envContent += "# Get your API keys from:\n"
      envContent += "# OpenAI: https://platform.openai.com/api-keys\n"
      envContent += "# Anthropic: https://console.anthropic.com/\n"
      envContent += "# Google: https://makersuite.google.com/app/apikey\n"
      envContent += "# Cohere: https://dashboard.cohere.ai/api-keys\n"
      envContent += "OPENAI_API_KEY=\n"
      envContent += "ANTHROPIC_API_KEY=\n"
      envContent += "GOOGLE_API_KEY=\n"
      envContent += "COHERE_API_KEY=\n"
      envContent += "GEMINI_API_KEY=\n"
      envContent += "MISTRAL_API_KEY=\n"

      envContent += "\n# === OPTIONAL SETTINGS ===\n"
      envContent += "# Add these if you want to use them:\n"
      envContent += "PHONE_NUMBER=\n"
      envContent += "OWNER_NUMBER=\n"
      envContent += "WEBHOOK_URL=\n"
      envContent += "ALLOWED_DOMAINS=\n"
      envContent += "BLOCKED_NUMBERS=\n"
      envContent += "ADMIN_NUMBERS=\n"

      await fs.writeFile(this.configPath, envContent)
      logger.info("📝 .env file created successfully")
    } catch (error) {
      logger.error("Failed to create .env file:", error)
      throw error
    }
  }

  async createAdditionalConfigs() {
    try {
      // Create config directory
      const configDir = path.join(process.cwd(), "config")
      await fs.mkdir(configDir, { recursive: true })

      // Create bot configuration file
      const botConfig = {
        version: "2.0.0",
        name: "EliTechWiz AI",
        description: "Revolutionary WhatsApp AI Bot",
        author: "EliTechWiz",
        features: {
          multiAI: true,
          analytics: true,
          plugins: true,
          webhooks: true,
          scheduler: true,
          mediaAI: true,
          voice: true,
          groupManagement: true,
          autoResponses: true,
          security: true,
        },
        supportedPlatforms: [
          "Vercel",
          "Netlify",
          "Heroku",
          "Railway",
          "Render",
          "Google Cloud",
          "AWS",
          "Azure",
          "Local",
        ],
        aiProviders: [
          "OpenAI",
          "Anthropic",
          "Google",
          "Cohere",
          "Hugging Face",
          "Mistral",
          "Perplexity",
          "Together",
          "Groq",
          "Replicate",
        ],
        setupCompleted: true,
        setupDate: new Date().toISOString(),
      }

      await fs.writeFile(path.join(configDir, "bot.json"), JSON.stringify(botConfig, null, 2))

      // Create features configuration
      const featuresConfig = {
        analytics: {
          enabled: true,
          trackMessages: true,
          trackUsers: true,
          trackPerformance: true,
          retentionDays: 30,
        },
        plugins: {
          enabled: true,
          autoLoad: true,
          directory: "./plugins",
          allowCustom: true,
        },
        webhooks: {
          enabled: false,
          events: ["message", "status", "connection"],
          retryAttempts: 3,
          timeout: 5000,
        },
        scheduler: {
          enabled: true,
          maxJobs: 100,
          timezone: "UTC",
        },
        mediaAI: {
          enabled: true,
          supportedTypes: ["image", "video", "audio", "document"],
          maxFileSize: "50MB",
        },
        voice: {
          enabled: true,
          speechToText: true,
          textToSpeech: true,
          supportedLanguages: ["en", "es", "fr", "de", "it", "pt"],
        },
        groupManagement: {
          enabled: true,
          autoModeration: true,
          welcomeMessages: true,
          adminCommands: true,
        },
        autoResponses: {
          enabled: true,
          smartReplies: true,
          contextAware: true,
          learningEnabled: true,
        },
        security: {
          enabled: true,
          rateLimit: true,
          encryption: true,
          spamProtection: true,
          userVerification: true,
        },
      }

      await fs.writeFile(path.join(configDir, "features.json"), JSON.stringify(featuresConfig, null, 2))

      logger.info("📋 Additional configuration files created")
    } catch (error) {
      logger.error("Failed to create additional configs:", error)
    }
  }

  async setupDirectories() {
    try {
      const directories = ["baileys_auth_info", "logs", "data", "plugins", "uploads", "cache", "backups", "config"]

      for (const dir of directories) {
        await fs.mkdir(path.join(process.cwd(), dir), { recursive: true })
      }

      // Create .gitkeep files to ensure directories are tracked
      for (const dir of directories) {
        const gitkeepPath = path.join(process.cwd(), dir, ".gitkeep")
        await fs.writeFile(gitkeepPath, "# This file ensures the directory is tracked by Git\n")
      }

      logger.info("📁 Directory structure created")
    } catch (error) {
      logger.error("Failed to setup directories:", error)
    }
  }

  async initializeDatabase() {
    try {
      // Create SQLite database file if using SQLite
      const dbPath = path.join(process.cwd(), "data", "bot.db")

      // Create basic schema
      const schema = `
        -- EliTechWiz AI Database Schema
        -- Auto-generated on ${new Date().toISOString()}
        
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone_number TEXT UNIQUE NOT NULL,
          name TEXT,
          is_admin BOOLEAN DEFAULT FALSE,
          is_blocked BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS conversations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          message TEXT,
          response TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );
        
        CREATE TABLE IF NOT EXISTS analytics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_type TEXT NOT NULL,
          data TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `

      await fs.writeFile(path.join(process.cwd(), "data", "schema.sql"), schema)
      logger.info("🗄️ Database schema created")
    } catch (error) {
      logger.error("Failed to initialize database:", error)
    }
  }

  maskSensitiveValues(config) {
    const masked = { ...config }
    const sensitiveKeys = [
      "ENCRYPTION_KEY",
      "ADMIN_PASSCODE",
      "WEBHOOK_SECRET",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "GOOGLE_API_KEY",
      "COHERE_API_KEY",
      "DATABASE_URL",
    ]

    for (const key of sensitiveKeys) {
      if (masked[key]) {
        masked[key] = "***MASKED***"
      }
    }

    return masked
  }

  async getSetupStatus() {
    try {
      const envExists = await fs
        .access(this.configPath)
        .then(() => true)
        .catch(() => false)
      const configExists = await fs
        .access(path.join(process.cwd(), "config", "bot.json"))
        .then(() => true)
        .catch(() => false)

      return {
        envFileExists: envExists,
        configFileExists: configExists,
        setupCompleted: envExists && configExists,
        lastSetup: envExists ? (await fs.stat(this.configPath)).mtime : null,
      }
    } catch (error) {
      return {
        envFileExists: false,
        configFileExists: false,
        setupCompleted: false,
        lastSetup: null,
        error: error.message,
      }
    }
  }
}

module.exports = { AutoConfigManager }

# WhatsApp Connection Guide for EliTechWiz AI

This guide explains how to connect your EliTechWiz AI bot to WhatsApp using the web interface.

## 🚀 Quick Start

1. **Deploy your bot** to any supported platform (Heroku, Railway, Render, etc.)
2. **Visit the connection page** at `https://your-app-url.com/connect`
3. **Choose your connection method** (QR Code or Pairing Code)
4. **Follow the step-by-step instructions** on the page
5. **Start chatting** with your AI bot!

## 🔗 Connection Methods

### Method 1: QR Code (Recommended)

**Best for:** Local development, personal use, when you have access to both devices

**Steps:**
1. Click "QR Code" method on the connection page
2. Click "Start Connection"
3. Open WhatsApp on your phone
4. Go to Settings → Linked Devices → Link a Device
5. Scan the QR code displayed on the page
6. ✅ Connected!

**Advantages:**
- Quick and easy
- No additional configuration needed
- Works immediately

**Requirements:**
- Access to both the web page and your phone
- Camera access for QR scanning

### Method 2: Pairing Code (For Servers)

**Best for:** Server deployments, headless environments, remote setups

**Steps:**
1. Set your phone number in environment variables: `PHONE_NUMBER=+1234567890`
2. Click "Pairing Code" method on the connection page
3. Click "Start Connection"
4. Note the 8-digit code displayed
5. Open WhatsApp → Settings → Linked Devices → Link a Device
6. Choose "Link with Phone Number instead"
7. Enter the 8-digit code
8. ✅ Connected!

**Advantages:**
- Works on headless servers
- No camera/QR scanning required
- Perfect for automated deployments

**Requirements:**
- Phone number configured in environment variables
- Access to WhatsApp on your phone

## 🛠️ Environment Configuration

### Required Environment Variables

\`\`\`bash
# Basic Configuration
AI_PROVIDER=openai                    # or anthropic, gemini, mistral
AI_MODEL=gpt-4o                      # Model to use
OPENAI_API_KEY=sk-...                # Your API key

# Connection Configuration (for Pairing Code method)
USE_PAIRING_CODE=true                # Enable pairing code method
PHONE_NUMBER=+1234567890             # Your phone number with country code

# Optional Configuration
BOT_NAME=EliTechWiz AI               # Custom bot name
BOT_MODE=private                     # private or public mode
OWNER_NUMBER=1234567890              # Owner's WhatsApp number
LOG_LEVEL=info                       # Logging level
\`\`\`

### Platform-Specific Setup

#### Heroku
\`\`\`bash
heroku config:set PHONE_NUMBER=+1234567890
heroku config:set USE_PAIRING_CODE=true
heroku config:set OPENAI_API_KEY=sk-...
\`\`\`

#### Railway
\`\`\`bash
railway variables set PHONE_NUMBER=+1234567890
railway variables set USE_PAIRING_CODE=true
railway variables set OPENAI_API_KEY=sk-...
\`\`\`

#### Render/DigitalOcean
Set environment variables in your platform's dashboard.

## 📱 Using the Web Interface

### Real-Time Status Updates

The connection page provides real-time updates about your bot's status:

- **🔄 Connecting**: Bot is attempting to connect to WhatsApp
- **⏳ Waiting**: Waiting for you to scan QR code or enter pairing code
- **✅ Connected**: Successfully connected and ready to use
- **❌ Error**: Connection failed with error details

### Connection Status Indicators

- **Green**: Bot is online and connected
- **Yellow**: Bot is connecting or waiting for authentication
- **Red**: Bot is offline or encountered an error

### Automatic Reconnection

The system automatically handles:
- Network disconnections
- WhatsApp server issues
- Temporary connection losses
- Session restoration

## 🎮 Bot Commands

Once connected, you can use these commands in WhatsApp:

### Basic Commands
- `/start` - Activate bot in current chat
- `/stop` - Deactivate bot in current chat
- `/help` - Show all available commands
- `/about` - Bot information and version
- `/status` - Check bot status
- `/ping` - Test bot responsiveness

### Configuration Commands (Owner Only)
- `/config` - View current configuration
- `/setmodel [provider] [model]` - Change AI model
- `/setmode [private|public]` - Set bot mode
- `/models [provider]` - List available models
- `/providers` - List AI providers

### Example Usage
\`\`\`
User: /start
Bot: 🤖 EliTechWiz AI is now active in this chat!

User: Hello, how are you?
Bot: Hello! I'm doing great, thank you for asking. I'm EliTechWiz AI, your intelligent assistant. How can I help you today?

User: /setmodel openai gpt-4o
Bot: ✅ Model Updated
Provider: openai
Model: gpt-4o
\`\`\`

## 🔧 Troubleshooting

### Common Issues

#### QR Code Not Displaying
- **Cause**: Network connectivity issues
- **Solution**: Refresh the page and try again
- **Alternative**: Use pairing code method instead

#### Pairing Code Not Generated
- **Cause**: Phone number not configured
- **Solution**: Set `PHONE_NUMBER` environment variable
- **Format**: Include country code (e.g., `+1234567890`)

#### Connection Keeps Dropping
- **Cause**: Network instability or server issues
- **Solution**: Check server logs and network connectivity
- **Note**: The system will automatically attempt to reconnect

#### "API Key Not Found" Error
- **Cause**: AI provider API key not configured
- **Solution**: Set the appropriate API key environment variable
- **Example**: `OPENAI_API_KEY=sk-...`

#### Bot Not Responding to Messages
- **Cause**: Bot not activated in the chat
- **Solution**: Send `/start` command in the chat
- **Check**: Verify bot mode (private vs public)

### Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Phone number not configured" | `PHONE_NUMBER` env var missing | Set phone number in environment |
| "Failed to generate QR code" | Network or server issue | Refresh page, check connectivity |
| "API key not found" | Missing AI provider API key | Configure API key in environment |
| "Connection timeout" | WhatsApp servers unreachable | Wait and retry, check internet |
| "Invalid pairing code" | Code expired or incorrect | Generate new code |

### Debug Mode

Enable debug logging for troubleshooting:

\`\`\`bash
LOG_LEVEL=debug
\`\`\`

This will provide detailed logs about:
- Connection attempts
- Message processing
- API calls
- Error details

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor API usage for unusual activity

### WhatsApp Security
- Only connect trusted devices
- Regularly review linked devices in WhatsApp settings
- Use strong passwords for your deployment platform
- Enable two-factor authentication where possible

### Bot Access Control
- Set owner number for administrative access
- Use private mode to control which chats the bot responds to
- Regularly review bot activity logs
- Implement rate limiting if needed

## 📊 Monitoring & Analytics

### Connection Monitoring
The web interface provides real-time monitoring of:
- Connection status
- Message throughput
- Error rates
- API usage

### Log Analysis
Monitor these log files for insights:
- `logs/combined.log` - All application logs
- `logs/error.log` - Error logs only
- `logs/messages.log` - WhatsApp message history

### Health Checks
Use these endpoints for monitoring:
- `GET /` - Basic status information
- `GET /health` - Simple health check
- `GET /connect` - Connection interface

## 🚀 Advanced Configuration

### Custom Bot Behavior
\`\`\`javascript
// Customize system prompt
const customPrompt = "You are a helpful customer service assistant..."

// Adjust response settings
const settings = {
  maxTokens: 1000,
  temperature: 0.7,
  maxContextLength: 10
}
\`\`\`

### Multi-Provider Setup
\`\`\`bash
# Configure multiple AI providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
GEMINI_API_KEY=...

# Switch between providers
AI_PROVIDER=openai  # or anthropic, gemini
\`\`\`

### Webhook Integration
\`\`\`bash
# Enable webhooks for external integrations
ENABLE_WEBHOOK=true
WEBHOOK_URL=https://your-webhook-endpoint.com
WEBHOOK_SECRET=your-secret-key
\`\`\`

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Review the logs** for error details
3. **Verify environment variables** are correctly set
4. **Test with different connection methods**
5. **Contact support** if issues persist

### Getting Help
- 📧 Email: support@elitechwiz.com
- 💬 Discord: [Join our community](https://discord.gg/elitechwiz)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/elitechwiz-ai/issues)
- 📖 Documentation: [Full Documentation](https://docs.elitechwiz.com)

---

**Happy chatting with your EliTechWiz AI bot! 🤖💬**
\`\`\`

## 10. Finally, let's update the main index.js to fix the import issue and ensure everything works:

\`\`\`typescriptreact file="index.js"
[v0-no-op-code-block-prefix]import {
  default as makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
} from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import pino from "pino"
import express from "express"
import http from "http"
import { Server } from "socket.io"
import path from 'path'
import readline from "readline"

import configManager from "./config-manager.js"
import { generateAIResponse, isAIServiceConfigured } from "./ai-service.js"
import { createLogger } from "./logger.js"
import { delay, getRandomTypingDelay, cleanPhoneNumber, isCommand, parseCommand } from "./utils.js"
import { handleConfigCommands, handleConfigHelp } from "./commands/config-commands.js"

// Initialize configuration
const configManagerInitialize = async () => {
  await configManager.initialize()
}

// Initialize logger
const logger = createLogger("main")
const logLevel = configManager.get("logLevel", "info")

// Initialize Express app for health checks
const app = express()
app.use(express.json())

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "running",
    bot: configManager.get("botName", "EliTechWiz AI"),
    timestamp: new Date().toISOString(),
  })
})

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" })
})

// Create HTTP server and Socket.IO
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Serve static files
app.use(express.static('public'))

// Serve connection page
app.get('/connect', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'connect.html'))
})

// Global variables
let sock
let state
let saveCreds
const conversationContext = new Map()
const activeBotChats = new Set()

// Create in-memory store for better performance
const store = makeInMemoryStore({
  logger: pino({ level: "silent" }),
})

// Commands
const commands = {
  "/start": async (jid) => {
    activeBotChats.add(jid)
    return `🤖 *${configManager.get("botName", "EliTechWiz AI")} is now active in this chat!*\n\nI'll respond to all messages in this conversation. To stop me, use the /stop command.\n\nType /help to see all available commands.`
  },

  "/stop": async (jid) => {
    activeBotChats.delete(jid)
    conversationContext.delete(jid) // Clear context when stopping
    return `🛑 *${configManager.get("botName", "EliTechWiz AI")} is now deactivated in this chat.*\n\nI won't respond to messages anymore. To activate me again, use the /start command.`
  },

  "/help": async () => {
    return (
      `📋 *${configManager.get("botName", "EliTechWiz AI")} Help*\n\n` +
      `I'm your AI assistant powered by advanced language models.\n\n` +
      `*Available Commands:*\n` +
      `🟢 /start - Activate the bot in this chat\n` +
      `🔴 /stop - Deactivate the bot in this chat\n` +
      `❓ /help - Show this help message\n` +
      `ℹ️ /about - Information about ${configManager.get("botName", "EliTechWiz AI")}\n` +
      `🗑️ /clear - Clear conversation context\n` +
      `🏓 /ping - Test bot responsiveness\n` +
      `📊 /status - Check bot status\n` +
      `🔧 /confighelp - Show configuration commands`
    )
  },

  "/about": async () => {
    const provider = configManager.get("aiProvider", "openai")
    const model = configManager.get("aiModel", "gpt-4o")

    return (
      `ℹ️ *About ${configManager.get("botName", "EliTechWiz AI")}*\n\n` +
      `I'm an AI assistant that uses advanced language models to provide helpful, accurate responses.\n\n` +
      `🔹 Provider: ${provider.toUpperCase()}\n` +
      `🔹 Model: ${model}\n` +
      `🔹 Version: 1.0.0\n\n` +
      `I can answer questions, provide information, and assist with various tasks. Just send me a message!`
    )
  },

  "/clear": async (jid) => {
    conversationContext.delete(jid)
    return `🗑️ Conversation context has been cleared.`
  },

  "/ping": async () => {
    return `🏓 Pong! I'm online and ready to help.`
  },

  "/status": async (jid) => {
    const isActive = activeBotChats.has(jid)
    const contextSize = conversationContext.get(jid)?.length || 0
    const provider = configManager.get("aiProvider", "openai")
    const model = configManager.get("aiModel", "gpt-4o")
    const botMode = configManager.get("botMode", "private")

    return (
      `📊 *Bot Status*\n\n` +
      `🔹 Bot Name: ${configManager.get("botName", "EliTechWiz AI")}\n` +
      `🔹 Bot Mode: ${botMode}\n` +
      `🔹 Active in this chat: ${isActive ? "Yes" : "No"}\n` +
      `🔹 Context messages: ${contextSize}\n` +
      `🔹 AI Provider: ${provider}\n` +
      `🔹 AI Model: ${model}\n` +
      `🔹 AI Service: ${isAIServiceConfigured() ? "Connected" : "Disconnected"}`
    )
  },

  "/confighelp": async (sock, jid) => {
    await handleConfigHelp(sock, jid)
    return null // Already sent message in handler
  },
}

/**
 * Initialize WhatsApp authentication state
 */
const initializeAuthState = async () => {
  const sessionDir = configManager.get("sessionDir", "./baileys_auth_info")
  const authState = await useMultiFileAuthState(sessionDir)
  state = authState.state
  saveCreds = authState.saveCreds
  logger.info("Authentication state initialized")
}

/**
 * Get pairing code for phone number
 */
const getPairingCode = async () => {
  const usePairingCode = configManager.get("usePairingCode", false)

  if (!usePairingCode) {
    return null
  }

  let phoneNumber = configManager.get("phoneNumber", "")

  if (!phoneNumber) {
    phoneNumber = process.env.PHONE_NUMBER || ""
    
    if (!phoneNumber) {
      // For web interface, emit error instead of prompting
      io.emit('connection-error', { error: 'Phone number not configured. Please set PHONE_NUMBER environment variable.' })
      return null
    }
  }

  return cleanPhoneNumber(phoneNumber)
}

/**
 * Create WhatsApp socket connection
 */
const createSocket = async () => {
  try {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    logger.info(`Using WhatsApp v${version.join(".")}, isLatest: ${isLatest}`)

    sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: !configManager.get("usePairingCode", false),
      mobile: false,
      browser: [configManager.get("botName", "EliTechWiz AI"), "Chrome", "94.0.4606.81"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
      },
      msgRetryCounterCache: new Map(),
      defaultQueryTimeoutMs: undefined,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      markOnlineOnConnect: true,
    })

    // Bind store to socket events
    store.bind(sock.ev)

    return sock
  } catch (error) {
    logger.error("Failed to create socket:", error)
    throw error
  }
}

/**
 * Handle pairing code authentication
 */
const handlePairingCode = async () => {
  const usePairingCode = configManager.get("usePairingCode", false)

  if (usePairingCode && !sock.authState.creds.registered) {
    let phoneNumber = configManager.get("phoneNumber", "")

    if (!phoneNumber) {
      // For web interface, we'll use a default or prompt via WebSocket
      phoneNumber = process.env.PHONE_NUMBER || ""
      
      if (!phoneNumber) {
        io.emit('connection-error', { error: 'Phone number not configured. Please set PHONE_NUMBER environment variable.' })
        return
      }
    }

    phoneNumber = cleanPhoneNumber(phoneNumber)
    logger.info(`Getting pairing code for ${phoneNumber}...`)

    try {
      const code = await sock.requestPairingCode(phoneNumber)
      logger.info(`Your pairing code: ${code}`)
      console.log(`\n🔐 Your pairing code: ${code}\n`)
      console.log("Enter this code in WhatsApp > Linked Devices > Link a Device > Link with Phone Number")
      
      // Emit pairing code to web clients
      io.emit('pairing-code', { code, phoneNumber })
    } catch (error) {
      logger.error("Failed to get pairing code:", error)
      io.emit('connection-error', { error: 'Failed to generate pairing code: ' + error.message })
      throw error
    }
  }
}

/**
 * Handle incoming messages
 */
const handleIncomingMessage = async (message) => {
  try {
    // Skip status broadcasts and own messages
    if (message.key.remoteJid === "status@broadcast" || message.key.fromMe) {
      return
    }

    const messageContent =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      message.message?.imageMessage?.caption ||
      ""

    if (!messageContent) return

    const senderJid = message.key.remoteJid
    const senderName = message.pushName || "Unknown"

    // Log incoming message
    logger.info(`📨 Incoming [${senderName}] [${senderJid}]: ${messageContent}`)

    // Handle commands
    if (isCommand(messageContent)) {
      await handleCommand(message, messageContent, senderJid)
      return
    }

    // Check bot mode
    const botMode = configManager.get("botMode", "private")

    // Only respond if bot is active in this chat or in public mode
    if (botMode !== "public" && !activeBotChats.has(senderJid)) {
      return
    }

    // Send typing indicator
    await sock.sendPresenceUpdate("composing", senderJid)

    try {
      // Get or initialize conversation context
      if (!conversationContext.has(senderJid)) {
        conversationContext.set(senderJid, [])
      }

      const context = conversationContext.get(senderJid)

      // Add user message to context
      context.push({ role: "user", content: messageContent })

      // Limit context size for performance
      const maxContextLength = configManager.get("maxContextLength", 10)
      if (context.length > maxContextLength) {
        context.splice(0, context.length - maxContextLength)
      }

      // Generate AI response
      const responseText = await generateAIResponse(context)

      // Add AI response to context
      context.push({ role: "assistant", content: responseText })

      // Random typing delay for more natural feel
      const typingDelay = getRandomTypingDelay()
      await delay(typingDelay)

      // Send response
      await sock.sendMessage(senderJid, { text: responseText })

      // Log outgoing message
      logger.info(`📤 Outgoing [${senderName}] [${senderJid}]: ${responseText}`)
    } catch (error) {
      logger.error("Error generating response:", error)
      await sock.sendMessage(senderJid, {
        text: `Sorry, I encountered an error while processing your message: ${error.message}. Please try again later.`,
      })
    }
  } catch (error) {
    logger.error("Error handling message:", error)
  } finally {
    // Clear typing indicator
    try {
      await sock.sendPresenceUpdate("paused", message.key.remoteJid)
    } catch (error) {
      // Ignore presence update errors
    }
  }
}

/**
 * Handle bot commands
 */
const handleCommand = async (message, messageContent, senderJid) => {
  try {
    await sock.sendPresenceUpdate("composing", senderJid)

    const { command, args } = parseCommand(messageContent)
    const commandName = command.substring(1).toLowerCase() // Remove the / prefix

    // Check if it's a configuration command
    if (
      ["setmodel", "setapikey", "setowner", "setmode", "config", "models", "providers", "resetconfig"].includes(
        commandName,
      )
    ) {
      await handleConfigCommands(sock, message, commandName, args, senderJid)
      return
    }

    // Handle regular commands
    if (commands[command]) {
      const responseText = await commands[command](senderJid, args, sock)

      if (responseText) {
        const typingDelay = getRandomTypingDelay()
        await delay(typingDelay)

        await sock.sendMessage(senderJid, { text: responseText })

        logger.info(`📤 Command response [${senderJid}]: ${command} -> ${responseText.substring(0, 50)}...`)
      }
    } else {
      await sock.sendMessage(senderJid, {
        text: `❌ Unknown command: ${command}\n\nType /help to see available commands.`,
      })
    }
  } catch (error) {
    logger.error("Error handling command:", error)
    await sock.sendMessage(senderJid, {
      text: `Sorry, I encountered an error while processing your command: ${error.message}. Please try again later.`,
    })
  } finally {
    await sock.sendPresenceUpdate("paused", senderJid)
  }
}

/**
 * Handle connection updates
 */
const handleConnectionUpdate = async (update) => {
  const { connection, lastDisconnect, qr } = update

  // Emit connection update to all clients
  io.emit('connection-update', {
    connection,
    lastDisconnect: lastDisconnect ? {
      error: lastDisconnect.error?.message,
      shouldReconnect: (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
    } : null
  })

  if (qr && !configManager.get("usePairingCode", false)) {
    logger.info("QR Code generated. Scan it with WhatsApp.")
    io.emit('qr-code', { qr })
  }

  if (connection === "close") {
    connectionStatus = 'disconnected'
    const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut

    logger.info(`Connection closed. Reason: ${lastDisconnect?.error}. Reconnecting: ${shouldReconnect}`)

    if (shouldReconnect) {
      logger.info("Reconnecting in 5 seconds...")
      await delay(5000)
      await connectToWhatsApp()
    } else {
      logger.error("Logged out. Please restart the application.")
      io.emit('connection-error', { error: 'Logged out. Please restart the application.' })
    }
  } else if (connection === "open") {
    connectionStatus = 'connected'
    logger.info(`✅ WhatsApp connection established successfully!`)
    console.log(`\n🎉 ${configManager.get("botName", "EliTechWiz AI")} is now connected to WhatsApp!\n`)

    // Emit success to all clients
    io.emit('connection-success', {
      botName: configManager.get("botName", "EliTechWiz AI"),
      timestamp: new Date().toISOString()
    })

    // Check AI service configuration
    if (!isAIServiceConfigured()) {
      logger.warn("⚠️ AI service is not properly configured. Please check your API keys.")
      console.log(
        "\n⚠️ AI service is not properly configured. Please set up your API keys using the /setapikey command.\n",
      )
    }
  } else if (connection === "connecting") {
    connectionStatus = 'connecting'
    logger.info("🔄 Connecting to WhatsApp...")
  }
}

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected to WebSocket')

  socket.on('start-connection', async (data) => {
    try {
      const { method } = data
      logger.info(`Starting connection with method: ${method}`)
      
      if (method === 'pairing') {
        configManager.set('usePairingCode', true)
      } else {
        configManager.set('usePairingCode', false)
      }

      // Restart connection with new method
      if (sock) {
        await sock.logout()
      }
      await connectToWhatsApp()
    } catch (error) {
      logger.error('Error starting connection:', error)
      socket.emit('connection-error', { error: error.message })
    }
  })

  socket.on('check-status', () => {
    socket.emit('bot-status', {
      connected: sock && sock.user,
      connectionStatus: connectionStatus
    })
  })

  socket.on('disconnect', () => {
    logger.info('Client disconnected from WebSocket')
  })
})

// Global connection status
let connectionStatus = 'disconnected'

/**
 * Main function to connect to WhatsApp
 */
const connectToWhatsApp = async () => {
  try {
    await initializeAuthState()
    sock = await createSocket()

    // Handle pairing code if needed
    await handlePairingCode()

    // Event handlers
    sock.ev.on("creds.update", saveCreds)
    sock.ev.on("connection.update", handleConnectionUpdate)

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type === "notify") {
        for (const message of messages) {
          await handleIncomingMessage(message)
        }
      }
    })

    // Handle calls (optional)
    sock.ev.on("call", async (callData) => {
      logger.info("Incoming call:", callData)
      // You can handle calls here if needed
    })
  } catch (error) {
    logger.error("Failed to connect to WhatsApp:", error)
    throw error
  }
}

/**
 * Graceful shutdown handler
 */
const setupGracefulShutdown = () => {
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`)

    try {
      if (sock) {
        await sock.logout()
      }
      process.exit(0)
    } catch (error) {
      logger.error("Error during shutdown:", error)
      process.exit(1)
    }
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))
}

/**
 * Start the application
 */
const startApplication = async () => {
  try {
    logger.info(`🚀 Starting ${configManager.get("botName", "EliTechWiz AI")}...`)

    // Setup graceful shutdown
    setupGracefulShutdown()

    // Start HTTP server
    const port = process.env.PORT || 3000
    server.listen(port, () => {
      logger.info(`🌐 HTTP server running on port ${port}`)
      logger.info(`🔗 Connection page available at: http://localhost:${port}/connect`)
    })

    // Connect to WhatsApp
    await connectToWhatsApp()
  } catch (error) {
    logger.error("❌ Failed to start application:", error)
    process.exit(1)
  }
}

// Start the application
configManagerInitialize().then(startApplication)

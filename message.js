import { createLogger } from "./logger.js"

// Initialize logger
const logger = createLogger("message")

/**
 * Message processing utilities for EliTechWiz AI
 */
class MessageHandler {
  constructor() {
    this.messageQueue = []
    this.processingQueue = false
  }

  /**
   * Process incoming WhatsApp message
   * @param {Object} msg - WhatsApp message object
   * @param {Object} sock - WhatsApp socket connection
   * @returns {Object} Processed message data
   */
  async processMessage(msg, sock) {
    try {
      const messageData = {
        id: msg.key.id,
        from: msg.key.remoteJid,
        fromMe: msg.key.fromMe,
        timestamp: msg.messageTimestamp,
        type: this.getMessageType(msg),
        content: this.extractMessageContent(msg),
        isGroup: msg.key.remoteJid.includes("@g.us"),
        participant: msg.key.participant || null,
      }

      // Log the message
      logger.info(`Message received from ${messageData.from}: ${messageData.content}`)

      return messageData
    } catch (error) {
      logger.error("Error processing message:", error)
      throw error
    }
  }

  /**
   * Extract message content based on message type
   * @param {Object} msg - WhatsApp message object
   * @returns {string} Message content
   */
  extractMessageContent(msg) {
    const message = msg.message

    if (message.conversation) {
      return message.conversation
    }

    if (message.extendedTextMessage) {
      return message.extendedTextMessage.text
    }

    if (message.imageMessage && message.imageMessage.caption) {
      return message.imageMessage.caption
    }

    if (message.videoMessage && message.videoMessage.caption) {
      return message.videoMessage.caption
    }

    if (message.documentMessage && message.documentMessage.caption) {
      return message.documentMessage.caption
    }

    return ""
  }

  /**
   * Get message type
   * @param {Object} msg - WhatsApp message object
   * @returns {string} Message type
   */
  getMessageType(msg) {
    const message = msg.message

    if (message.conversation || message.extendedTextMessage) {
      return "text"
    }

    if (message.imageMessage) {
      return "image"
    }

    if (message.videoMessage) {
      return "video"
    }

    if (message.audioMessage) {
      return "audio"
    }

    if (message.documentMessage) {
      return "document"
    }

    if (message.stickerMessage) {
      return "sticker"
    }

    if (message.locationMessage) {
      return "location"
    }

    if (message.contactMessage) {
      return "contact"
    }

    return "unknown"
  }

  /**
   * Format message for AI processing
   * @param {Object} messageData - Processed message data
   * @param {Object} config - Bot configuration
   * @returns {string} Formatted message for AI
   */
  formatForAI(messageData, config) {
    let formattedMessage = messageData.content

    // Add context if it's a group message
    if (messageData.isGroup) {
      const senderNumber = messageData.participant || messageData.from
      formattedMessage = `[Group Message from ${senderNumber}]: ${formattedMessage}`
    }

    // Add timestamp context if needed
    if (config.includeTimestamp) {
      const timestamp = new Date(messageData.timestamp * 1000).toLocaleString()
      formattedMessage = `[${timestamp}] ${formattedMessage}`
    }

    return formattedMessage
  }

  /**
   * Validate message before processing
   * @param {Object} messageData - Message data to validate
   * @param {Object} config - Bot configuration
   * @returns {boolean} Whether message is valid for processing
   */
  validateMessage(messageData, config) {
    // Skip messages from self
    if (messageData.fromMe) {
      return false
    }

    // Skip empty messages
    if (!messageData.content || messageData.content.trim() === "") {
      return false
    }

    // Check if bot is in private mode and message is not from owner
    if (config.botMode === "private" && messageData.from !== config.ownerNumber) {
      return false
    }

    // Skip non-text messages if configured
    if (config.textOnly && messageData.type !== "text") {
      return false
    }

    return true
  }

  /**
   * Add message to processing queue
   * @param {Object} messageData - Message to queue
   */
  queueMessage(messageData) {
    this.messageQueue.push({
      ...messageData,
      queuedAt: Date.now(),
    })

    if (!this.processingQueue) {
      this.processQueue()
    }
  }

  /**
   * Process message queue
   */
  async processQueue() {
    this.processingQueue = true

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      try {
        // Process message here
        await this.handleQueuedMessage(message)
      } catch (error) {
        logger.error("Error processing queued message:", error)
      }
    }

    this.processingQueue = false
  }

  /**
   * Handle queued message
   * @param {Object} message - Queued message
   */
  async handleQueuedMessage(message) {
    // This method can be overridden or extended
    logger.info(`Processing queued message from ${message.from}`)
  }

  /**
   * Clean old messages from queue
   * @param {number} maxAge - Maximum age in milliseconds
   */
  cleanOldMessages(maxAge = 300000) {
    // 5 minutes default
    const now = Date.now()
    this.messageQueue = this.messageQueue.filter((msg) => now - msg.queuedAt < maxAge)
  }

  /**
   * Get queue status
   * @returns {Object} Queue status information
   */
  getQueueStatus() {
    return {
      queueLength: this.messageQueue.length,
      processing: this.processingQueue,
      oldestMessage: this.messageQueue.length > 0 ? this.messageQueue[0].queuedAt : null,
    }
  }
}

// Create singleton instance
const messageHandler = new MessageHandler()

/**
 * Main message processing function
 * @param {Object} msg - WhatsApp message object
 * @param {Object} sock - WhatsApp socket connection
 * @param {Object} config - Bot configuration
 * @returns {Object} Processed message data
 */
export async function message(msg, sock, config = {}) {
  try {
    // Process the message
    const messageData = await messageHandler.processMessage(msg, sock)

    // Validate the message
    if (!messageHandler.validateMessage(messageData, config)) {
      return null
    }

    // Format for AI if needed
    if (config.formatForAI) {
      messageData.aiFormattedContent = messageHandler.formatForAI(messageData, config)
    }

    return messageData
  } catch (error) {
    logger.error("Error in message function:", error)
    throw error
  }
}

/**
 * Utility functions for message handling
 */
export const messageUtils = {
  /**
   * Extract phone number from JID
   * @param {string} jid - WhatsApp JID
   * @returns {string} Phone number
   */
  extractPhoneNumber(jid) {
    return jid.split("@")[0]
  },

  /**
   * Format phone number for WhatsApp
   * @param {string} number - Phone number
   * @returns {string} Formatted JID
   */
  formatPhoneNumber(number) {
    // Remove all non-numeric characters
    const cleaned = number.replace(/\D/g, "")

    // Add country code if missing
    if (!cleaned.startsWith("1") && cleaned.length === 10) {
      return `1${cleaned}@s.whatsapp.net`
    }

    return `${cleaned}@s.whatsapp.net`
  },

  /**
   * Check if JID is a group
   * @param {string} jid - WhatsApp JID
   * @returns {boolean} Whether it's a group
   */
  isGroup(jid) {
    return jid.includes("@g.us")
  },

  /**
   * Check if JID is a broadcast
   * @param {string} jid - WhatsApp JID
   * @returns {boolean} Whether it's a broadcast
   */
  isBroadcast(jid) {
    return jid.includes("@broadcast")
  },

  /**
   * Get message preview
   * @param {string} content - Message content
   * @param {number} maxLength - Maximum length for preview
   * @returns {string} Message preview
   */
  getPreview(content, maxLength = 50) {
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength) + "..."
  },
}

// Export the handler and class as well
export { messageHandler, MessageHandler }

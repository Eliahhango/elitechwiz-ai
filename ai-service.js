import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { createLogger } from "./logger.js"
import configManager from "./config-manager.js"

// Initialize logger
const logger = createLogger("ai-service")

// System prompt to define the AI's behavior
function getSystemPrompt() {
  const botName = configManager.get("botName", "EliTechWiz AI")

  return `You are ${botName}, a helpful, knowledgeable, and professional AI assistant.
When asked about your identity, always identify yourself as "${botName}".
Be polite, helpful, and provide accurate information.
Keep responses concise and to the point, suitable for WhatsApp messaging.
If you don't know something, admit it rather than making up information.
Respond in the same language as the user's message when possible.`
}

/**
 * Get the appropriate AI model based on configuration
 * @returns {Object} Configured AI model
 */
function getAIModel() {
  try {
    const provider = configManager.get("aiProvider", "openai")
    const model = configManager.get("aiModel", "gpt-4o")
    const apiKey = configManager.getApiKey(provider)

    if (!apiKey) {
      throw new Error(`API key not set for ${provider}`)
    }

    switch (provider) {
      case "anthropic":
        return anthropic(model, { apiKey })

      case "openai":
      default:
        return openai(model, { apiKey })
    }
  } catch (error) {
    logger.error("Error initializing AI model:", error)
    throw error
  }
}

/**
 * Generate AI response based on conversation context
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<string>} - AI generated response
 */
export async function generateAIResponse(messages) {
  try {
    const model = getAIModel()
    const provider = configManager.get("aiProvider", "openai")
    const modelName = configManager.get("aiModel", "gpt-4o")

    logger.debug(`Generating response using ${provider} model ${modelName}`)

    // Limit context to prevent token overflow
    const maxContextLength = configManager.get("maxContextLength", 10)
    const limitedMessages = messages.slice(-maxContextLength)

    const { text } = await generateText({
      model: model,
      system: getSystemPrompt(),
      messages: limitedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      maxTokens: 1000, // Limit response length for WhatsApp
      temperature: 0.7,
    })

    return text
  } catch (error) {
    logger.error("Error generating AI response:", error)

    // Return a fallback message instead of throwing
    return `Sorry, I'm experiencing technical difficulties right now. Please try again in a moment.`
  }
}

/**
 * Check if AI service is properly configured
 * @returns {boolean} - True if properly configured
 */
export function isAIServiceConfigured() {
  try {
    const provider = configManager.get("aiProvider", "openai")
    const apiKey = configManager.getApiKey(provider)

    if (!apiKey) {
      logger.warn(`API key not set for ${provider}`)
      return false
    }

    return true
  } catch (error) {
    logger.error("AI service not properly configured:", error.message)
    return false
  }
}

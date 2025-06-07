import configManager from "./config-manager.js"

/**
 * Delay execution for specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate a random typing delay
 * @returns {number} - Random delay in milliseconds
 */
export function getRandomTypingDelay() {
  const typingDelayMin = configManager.get("typingDelayMin", 1000)
  const typingDelayMax = configManager.get("typingDelayMax", 3000)
  return Math.floor(Math.random() * (typingDelayMax - typingDelayMin) + typingDelayMin)
}

/**
 * Clean and validate phone number for pairing code
 * @param {string} phoneNumber - Phone number to clean
 * @returns {string} - Cleaned phone number
 */
export function cleanPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/[^0-9]/g, "")
}

/**
 * Check if a message is a command
 * @param {string} message - Message to check
 * @returns {boolean} - True if message is a command
 */
export function isCommand(message) {
  return message.startsWith("/")
}

/**
 * Extract command and arguments from message
 * @param {string} message - Message containing command
 * @returns {Object} - Object with command and args
 */
export function parseCommand(message) {
  const parts = message.split(" ")
  const command = parts[0]
  const args = parts.slice(1)
  return { command, args }
}

/**
 * Format error message for user
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export function formatErrorMessage(error) {
  return `Sorry, I encountered an error: ${error.message}. Please try again later.`
}

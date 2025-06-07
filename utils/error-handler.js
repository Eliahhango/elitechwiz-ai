import { createLogger } from "../logger.js"

const logger = createLogger("error-handler")

/**
 * Global error handler for API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} Wrapped handler with error handling
 */
export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res)
    } catch (error) {
      logger.error("Unhandled error in API route:", error)

      // Don't expose internal errors in production
      const isDevelopment = process.env.NODE_ENV === "development"

      return res.status(500).json({
        error: "Internal server error",
        message: isDevelopment ? error.message : "Something went wrong",
        stack: isDevelopment ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      })
    }
  }
}

/**
 * Validate request body
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Required field names
 * @returns {Object} Validation result
 */
export function validateRequestBody(body, requiredFields = []) {
  const errors = []

  if (!body || typeof body !== "object") {
    errors.push("Request body is required and must be an object")
    return { isValid: false, errors }
  }

  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize error for client response
 * @param {Error} error - Error object
 * @param {boolean} isDevelopment - Whether in development mode
 * @returns {Object} Sanitized error
 */
export function sanitizeError(error, isDevelopment = false) {
  const sanitized = {
    message: "An error occurred",
    timestamp: new Date().toISOString(),
  }

  if (isDevelopment) {
    sanitized.message = error.message
    sanitized.stack = error.stack
    sanitized.name = error.name
  } else {
    // Only expose safe error messages in production
    const safeMessages = ["Invalid input", "Not found", "Unauthorized", "Forbidden", "Bad request"]

    if (safeMessages.some((msg) => error.message.toLowerCase().includes(msg.toLowerCase()))) {
      sanitized.message = error.message
    }
  }

  return sanitized
}

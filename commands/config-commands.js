import configManager from "../config-manager.js"
import { createLogger } from "../logger.js"
import { message } from "../message.js" // Declare the message variable

// Initialize logger
const logger = createLogger("config-commands")

/**
 * Handle configuration commands
 * @param {object} sock - WhatsApp socket connection
 * @param {object} message - Message object
 * @param {string} command - Command name
 * @param {string[]} args - Command arguments
 * @param {string} senderJid - Sender JID
 */
export async function handleConfigCommands(sock, message, command, args, senderJid) {
  const senderNumber = senderJid.split("@")[0]
  const isOwner = configManager.isOwner(senderNumber)

  // Commands that require owner privileges
  if (!isOwner) {
    // Check if admin passcode is provided
    const passcode = args[0]
    if (!passcode || !configManager.validateAdminPasscode(passcode)) {
      await sock.sendMessage(senderJid, {
        text: "⛔ *Access Denied*\n\nYou need to be the bot owner or provide a valid admin passcode to use configuration commands.",
      })
      return
    }

    // Remove passcode from args
    args.shift()
  }

  switch (command) {
    case "setmodel":
      await handleSetModel(sock, senderJid, args)
      break
    case "setapikey":
      await handleSetApiKey(sock, senderJid, args)
      break
    case "setowner":
      await handleSetOwner(sock, senderJid, args)
      break
    case "setmode":
      await handleSetMode(sock, senderJid, args)
      break
    case "config":
      await handleShowConfig(sock, senderJid)
      break
    case "models":
      await handleListModels(sock, senderJid, args)
      break
    case "providers":
      await handleListProviders(sock, senderJid)
      break
    case "resetconfig":
      await handleResetConfig(sock, senderJid)
      break
    default:
      await sock.sendMessage(senderJid, {
        text: "❓ *Unknown Configuration Command*\n\nType */confighelp* to see available configuration commands.",
      })
  }
}

/**
 * Handle set model command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 * @param {string[]} args - Command arguments
 */
async function handleSetModel(sock, senderJid, args) {
  if (args.length < 2) {
    await sock.sendMessage(senderJid, {
      text: "❌ *Invalid Command*\n\nUsage: */setmodel [provider] [model]*\n\nExample: */setmodel openai gpt-4o*\n\nType */models* to see available models.",
    })
    return
  }

  const provider = args[0].toLowerCase()
  const model = args[1]

  // Check if provider is valid
  const availableProviders = configManager.getAvailableProviders()
  if (!availableProviders.includes(provider)) {
    await sock.sendMessage(senderJid, {
      text: `❌ *Invalid Provider*\n\nAvailable providers: ${availableProviders.join(", ")}\n\nType */providers* to see available providers.`,
    })
    return
  }

  // Check if model is valid for the provider
  const availableModels = configManager.getAvailableModels(provider)
  if (!availableModels.includes(model)) {
    await sock.sendMessage(senderJid, {
      text: `❌ *Invalid Model*\n\nAvailable models for ${provider}: ${availableModels.join(", ")}\n\nType */models ${provider}* to see available models.`,
    })
    return
  }

  // Check if API key is set for the provider
  const apiKey = configManager.getApiKey(provider)
  if (!apiKey) {
    await sock.sendMessage(senderJid, {
      text: `⚠️ *Warning*\n\nNo API key set for ${provider}. Please set an API key using */setapikey ${provider} [your_api_key]*`,
    })
  }

  // Update configuration
  await configManager.set("aiProvider", provider)
  await configManager.set("aiModel", model)

  await sock.sendMessage(senderJid, {
    text: `✅ *Model Updated*\n\nProvider: ${provider}\nModel: ${model}\n\nThe bot will now use ${provider}'s ${model} for generating responses.`,
  })

  logger.info(`AI model updated to ${provider}/${model}`)
}

/**
 * Handle set API key command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 * @param {string[]} args - Command arguments
 */
async function handleSetApiKey(sock, senderJid, args) {
  if (args.length < 2) {
    await sock.sendMessage(senderJid, {
      text: "❌ *Invalid Command*\n\nUsage: */setapikey [provider] [api_key]*\n\nExample: */setapikey openai sk-....*",
    })
    return
  }

  const provider = args[0].toLowerCase()
  const apiKey = args[1]

  // Check if provider is valid
  const availableProviders = configManager.getAvailableProviders()
  if (!availableProviders.includes(provider)) {
    await sock.sendMessage(senderJid, {
      text: `❌ *Invalid Provider*\n\nAvailable providers: ${availableProviders.join(", ")}`,
    })
    return
  }

  // Update API key
  await configManager.setApiKey(provider, apiKey)

  await sock.sendMessage(senderJid, {
    text: `✅ *API Key Updated*\n\nProvider: ${provider}\n\nThe API key has been securely stored.`,
  })

  // Delete the message containing the API key for security
  try {
    await sock.sendMessage(senderJid, { delete: message.key })
  } catch (error) {
    logger.error("Failed to delete message containing API key:", error)
  }

  logger.info(`API key updated for ${provider}`)
}

/**
 * Handle set owner command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 * @param {string[]} args - Command arguments
 */
async function handleSetOwner(sock, senderJid, args) {
  if (args.length < 1) {
    await sock.sendMessage(senderJid, {
      text: "❌ *Invalid Command*\n\nUsage: */setowner [phone_number]*\n\nExample: */setowner 1234567890*\n\nNote: Enter the number without any symbols or spaces.",
    })
    return
  }

  const ownerNumber = args[0].replace(/[^0-9]/g, "")

  // Update owner number
  await configManager.set("ownerNumber", ownerNumber)

  await sock.sendMessage(senderJid, {
    text: `✅ *Owner Updated*\n\nNew owner number: ${ownerNumber}\n\nThis number now has full administrative access to the bot.`,
  })

  logger.info(`Owner number updated to ${ownerNumber}`)
}

/**
 * Handle set mode command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 * @param {string[]} args - Command arguments
 */
async function handleSetMode(sock, senderJid, args) {
  if (args.length < 1) {
    await sock.sendMessage(senderJid, {
      text: "❌ *Invalid Command*\n\nUsage: */setmode [mode]*\n\nAvailable modes:\n- *private*: Only respond to specific chats\n- *public*: Respond to all chats",
    })
    return
  }

  const mode = args[0].toLowerCase()

  // Check if mode is valid
  if (mode !== "private" && mode !== "public") {
    await sock.sendMessage(senderJid, {
      text: "❌ *Invalid Mode*\n\nAvailable modes:\n- *private*: Only respond to specific chats\n- *public*: Respond to all chats",
    })
    return
  }

  // Update bot mode
  await configManager.set("botMode", mode)

  await sock.sendMessage(senderJid, {
    text: `✅ *Bot Mode Updated*\n\nNew mode: ${mode}\n\n${mode === "private" ? "The bot will now only respond in chats where it has been explicitly activated." : "The bot will now respond in all chats."}`,
  })

  logger.info(`Bot mode updated to ${mode}`)
}

/**
 * Handle show config command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 */
async function handleShowConfig(sock, senderJid) {
  const config = configManager.exportConfig()

  // Format configuration for display
  const provider = config.aiProvider
  const model = config.aiModel
  const botMode = config.botMode
  const ownerNumber = config.ownerNumber || "Not set"
  const apiKeyStatus = configManager.getApiKey(provider) ? "✅ Set" : "❌ Not set"

  const configText =
    `🔧 *Bot Configuration*\n\n` +
    `*Bot Name:* ${config.botName}\n` +
    `*Bot Mode:* ${botMode}\n` +
    `*Owner Number:* ${ownerNumber}\n\n` +
    `*AI Provider:* ${provider}\n` +
    `*AI Model:* ${model}\n` +
    `*API Key:* ${apiKeyStatus}\n\n` +
    `*Command Prefix:* ${config.commandPrefix}\n` +
    `*Log Level:* ${config.logLevel}\n` +
    `*Session Directory:* ${config.sessionDir}`

  await sock.sendMessage(senderJid, { text: configText })
}

/**
 * Handle list models command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 * @param {string[]} args - Command arguments
 */
async function handleListModels(sock, senderJid, args) {
  const provider = args[0]?.toLowerCase() || configManager.get("aiProvider")
  const availableModels = configManager.getAvailableModels(provider)

  if (!availableModels || availableModels.length === 0) {
    await sock.sendMessage(senderJid, {
      text: `❌ *Invalid Provider*\n\nNo models found for provider: ${provider}\n\nType */providers* to see available providers.`,
    })
    return
  }

  const currentModel = configManager.get("aiModel")
  const modelsList = availableModels.map((model) => `${model === currentModel ? "✅ " : ""}${model}`).join("\n")

  await sock.sendMessage(senderJid, {
    text: `📋 *Available Models for ${provider}*\n\n${modelsList}\n\nTo set a model, use */setmodel ${provider} [model_name]*`,
  })
}

/**
 * Handle list providers command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 */
async function handleListProviders(sock, senderJid) {
  const availableProviders = configManager.getAvailableProviders()
  const currentProvider = configManager.get("aiProvider")

  const providersList = availableProviders
    .map((provider) => {
      const apiKey = configManager.getApiKey(provider)
      const apiKeyStatus = apiKey ? "✅" : "❌"
      return `${provider === currentProvider ? "✅ " : ""}${provider} ${apiKeyStatus}`
    })
    .join("\n")

  await sock.sendMessage(senderJid, {
    text: `📋 *Available AI Providers*\n\n${providersList}\n\n✅ = Current provider\n✅ = API key set\n❌ = API key not set\n\nTo see models for a provider, use */models [provider]*`,
  })
}

/**
 * Handle reset config command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 */
async function handleResetConfig(sock, senderJid) {
  // Reset configuration to defaults
  await configManager.initialize()

  await sock.sendMessage(senderJid, {
    text: "✅ *Configuration Reset*\n\nAll configuration settings have been reset to default values.",
  })

  logger.info("Configuration reset to defaults")
}

/**
 * Handle configuration help command
 * @param {object} sock - WhatsApp socket connection
 * @param {string} senderJid - Sender JID
 */
export async function handleConfigHelp(sock, senderJid) {
  const helpText =
    `🔧 *Configuration Commands*\n\n` +
    `*/config* - Show current configuration\n` +
    `*/setmodel [provider] [model]* - Set AI model\n` +
    `*/setapikey [provider] [api_key]* - Set API key\n` +
    `*/setowner [phone_number]* - Set owner number\n` +
    `*/setmode [private|public]* - Set bot mode\n` +
    `*/models [provider]* - List available models\n` +
    `*/providers* - List available providers\n` +
    `*/resetconfig* - Reset configuration to defaults\n\n` +
    `Note: Configuration commands require owner privileges or admin passcode.`

  await sock.sendMessage(senderJid, { text: helpText })
}

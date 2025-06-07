const { message, messageUtils } = require("./message")

// Assuming 'sock' and 'config' are defined elsewhere in your code
// and that you have a logger defined.

sock.ev.on("messages.upsert", async (m) => {
  try {
    const msg = m.messages[0]
    if (!msg.message) return

    // Process message using the message module
    const messageData = await message(msg, sock, {
      botMode: config.botMode || "public",
      ownerNumber: config.ownerNumber,
      formatForAI: true,
      textOnly: false,
      includeTimestamp: true,
    })

    if (!messageData) return // Message was filtered out

    // Continue with existing AI processing logic
    const userMessage = messageData.content
    const from = messageData.from

    // Rest of the existing message handling code...
    // Example:
    // console.log(`Received message from ${from}: ${userMessage}`);
    // You would likely have AI processing logic here, sending responses, etc.
  } catch (error) {
    logger.error("Error handling message:", error)
  }
})

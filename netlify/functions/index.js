// This file is a simple adapter for Netlify Functions
// It imports and runs our main application

import "../../index.js"

// Export a handler function for Netlify
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "EliTechWiz AI is running" }),
  }
}

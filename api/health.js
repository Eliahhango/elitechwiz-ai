export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Basic health checks
    const healthChecks = {
      timestamp: new Date().toISOString(),
      status: "healthy",
      platform: detectPlatform(req),
      environment: process.env.NODE_ENV || "production",
      version: "2.0.0",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        api: true,
        environment: checkEnvironment(),
        dependencies: await checkDependencies(),
      },
    }

    // Determine overall status
    const allChecksPass = Object.values(healthChecks.checks).every((check) => check === true)
    healthChecks.status = allChecksPass ? "healthy" : "degraded"

    return res.status(200).json(healthChecks)
  } catch (error) {
    console.error("Health check error:", error)

    return res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

function detectPlatform(req) {
  const hostname = req.headers.host || ""

  if (hostname.includes("vercel.app") || process.env.VERCEL) {
    return "Vercel"
  } else if (hostname.includes("netlify.app") || process.env.NETLIFY) {
    return "Netlify"
  } else if (hostname.includes("herokuapp.com") || process.env.DYNO) {
    return "Heroku"
  } else if (hostname.includes("railway.app") || process.env.RAILWAY_ENVIRONMENT) {
    return "Railway"
  } else if (hostname.includes("render.com") || process.env.RENDER) {
    return "Render"
  } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    return "Local"
  } else {
    return "Unknown"
  }
}

function checkEnvironment() {
  try {
    // Check if essential environment variables are accessible
    const hasNodeEnv = !!process.env.NODE_ENV
    const hasOpenAI = !!process.env.OPENAI_API_KEY

    return hasNodeEnv // Basic check
  } catch (error) {
    return false
  }
}

async function checkDependencies() {
  try {
    // Try to import key dependencies
    await import("@whiskeysockets/baileys")
    await import("pino")
    return true
  } catch (error) {
    console.error("Dependency check failed:", error)
    return false
  }
}

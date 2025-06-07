export default async function handler(req, res) {
  // Enhanced CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  res.setHeader("Access-Control-Max-Age", "86400")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["GET", "OPTIONS"],
    })
  }

  try {
    // Advanced deployment detection
    const deploymentInfo = getDeploymentInfo(req)
    const forkVerification = await performForkVerification(deploymentInfo)

    // Security checks
    const securityChecks = performSecurityChecks(req)

    // Platform compatibility checks
    const platformChecks = performPlatformChecks(deploymentInfo)

    const response = {
      ...forkVerification,
      deploymentInfo,
      securityChecks,
      platformChecks,
      verification: {
        timestamp: new Date().toISOString(),
        method: "advanced_multi_check",
        version: "2.0.0",
        checksum: generateChecksum(forkVerification),
      },
    }

    // Log verification attempt
    console.log(
      `🔍 Fork verification: ${forkVerification.isForked ? "VERIFIED" : "FAILED"} - ${deploymentInfo.platform}`,
    )

    return res.status(200).json(response)
  } catch (error) {
    console.error("🚨 Fork verification error:", error)

    // Graceful fallback for development
    if (isDevelopmentEnvironment(req)) {
      return res.status(200).json({
        isForked: true,
        isOriginal: false,
        isDevelopment: true,
        fallback: true,
        message: "Development environment - verification bypassed",
        error: error.message,
      })
    }

    return res.status(500).json({
      error: "Verification failed",
      message: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

function getDeploymentInfo(req) {
  const hostname = req.headers.host || ""
  const userAgent = req.headers["user-agent"] || ""
  const forwardedFor = req.headers["x-forwarded-for"] || ""

  // Platform detection with enhanced logic
  let platform = "unknown"
  let provider = "unknown"

  if (process.env.VERCEL || hostname.includes("vercel.app")) {
    platform = "Vercel"
    provider = "vercel"
  } else if (process.env.NETLIFY || hostname.includes("netlify.app")) {
    platform = "Netlify"
    provider = "netlify"
  } else if (process.env.DYNO || hostname.includes("herokuapp.com")) {
    platform = "Heroku"
    provider = "heroku"
  } else if (process.env.RAILWAY_ENVIRONMENT || hostname.includes("railway.app")) {
    platform = "Railway"
    provider = "railway"
  } else if (process.env.RENDER || hostname.includes("render.com")) {
    platform = "Render"
    provider = "render"
  } else if (process.env.GOOGLE_CLOUD_PROJECT || hostname.includes("appspot.com")) {
    platform = "Google Cloud"
    provider = "gcp"
  } else if (process.env.AWS_REGION || hostname.includes("amazonaws.com")) {
    platform = "AWS"
    provider = "aws"
  } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    platform = "Local Development"
    provider = "local"
  } else {
    platform = "Custom/Unknown"
    provider = "custom"
  }

  return {
    hostname,
    platform,
    provider,
    userAgent,
    forwardedFor,
    environment: process.env.NODE_ENV || "production",
    region: process.env.VERCEL_REGION || process.env.AWS_REGION || "unknown",
    gitInfo: {
      provider: process.env.VERCEL_GIT_PROVIDER || process.env.GIT_PROVIDER,
      owner: process.env.VERCEL_GIT_REPO_OWNER || process.env.GIT_OWNER,
      repo: process.env.VERCEL_GIT_REPO_SLUG || process.env.GIT_REPO,
      branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH,
      commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT,
    },
  }
}

async function performForkVerification(deploymentInfo) {
  const originalOwner = "elitechwiz"
  const originalRepo = "whatsapp-ai-bot"

  const { gitInfo, platform, hostname } = deploymentInfo

  // Check if this is the original repository
  const isOriginal = gitInfo.owner === originalOwner && gitInfo.repo === originalRepo

  // Multiple verification methods
  let isForked = false
  let verificationMethod = "none"
  let confidence = 0

  // Method 1: Git environment variables
  if (gitInfo.owner && gitInfo.repo && !isOriginal) {
    isForked = true
    verificationMethod = "git_env_vars"
    confidence = 90
  }

  // Method 2: Deployment URL pattern analysis
  if (!isForked && hostname) {
    const urlPatterns = [
      /^(?!elitechwiz-ai)[\w-]+\.vercel\.app$/,
      /^(?!elitechwiz-ai)[\w-]+\.netlify\.app$/,
      /^(?!elitechwiz-ai)[\w-]+\.herokuapp\.com$/,
      /^(?!elitechwiz-ai)[\w-]+\.railway\.app$/,
      /^(?!elitechwiz-ai)[\w-]+\.render\.com$/,
    ]

    if (urlPatterns.some((pattern) => pattern.test(hostname))) {
      isForked = true
      verificationMethod = "url_pattern"
      confidence = 70
    }
  }

  // Method 3: Custom domain detection
  if (!isForked && !hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
    const knownPlatformDomains = [
      "vercel.app",
      "netlify.app",
      "herokuapp.com",
      "railway.app",
      "render.com",
      "appspot.com",
    ]

    const isCustomDomain = !knownPlatformDomains.some((domain) => hostname.includes(domain))
    if (isCustomDomain) {
      isForked = true
      verificationMethod = "custom_domain"
      confidence = 60
    }
  }

  // Method 4: Environment variable fingerprinting
  if (!isForked) {
    const hasCustomEnvVars = !!(process.env.CUSTOM_BOT_NAME || process.env.CUSTOM_OWNER || process.env.FORK_IDENTIFIER)

    if (hasCustomEnvVars) {
      isForked = true
      verificationMethod = "env_fingerprint"
      confidence = 50
    }
  }

  // Method 5: Deployment timestamp analysis
  if (!isForked && process.env.VERCEL_GIT_COMMIT_CREATED_AT) {
    const deployTime = new Date(process.env.VERCEL_GIT_COMMIT_CREATED_AT)
    const originalCreationTime = new Date("2024-01-01") // Approximate original creation

    if (deployTime > originalCreationTime) {
      isForked = true
      verificationMethod = "timestamp_analysis"
      confidence = 40
    }
  }

  return {
    isForked,
    isOriginal,
    verificationMethod,
    confidence,
    forkInfo: isForked
      ? {
          owner: gitInfo.owner || "unknown",
          repo: gitInfo.repo || "unknown",
          branch: gitInfo.branch || "main",
          provider: gitInfo.provider || "unknown",
        }
      : null,
  }
}

function performSecurityChecks(req) {
  const checks = {
    hasValidHeaders: !!(req.headers.host && req.headers["user-agent"]),
    isSecureConnection: req.headers["x-forwarded-proto"] === "https" || req.connection?.encrypted,
    hasValidOrigin: true, // Could add origin validation
    rateLimitOk: true, // Could add rate limiting
    geoLocationOk: true, // Could add geo-blocking
    score: 0,
  }

  // Calculate security score
  const passedChecks = Object.values(checks).filter((check) => check === true).length - 1 // Exclude score
  checks.score = Math.round((passedChecks / 5) * 100)

  return checks
}

function performPlatformChecks(deploymentInfo) {
  const { platform, provider } = deploymentInfo

  const supportedPlatforms = [
    "Vercel",
    "Netlify",
    "Heroku",
    "Railway",
    "Render",
    "Google Cloud",
    "AWS",
    "Azure",
    "Local Development",
  ]

  return {
    isSupported: supportedPlatforms.includes(platform),
    platform,
    provider,
    compatibility: platform === "Local Development" ? "development" : "production",
    features: {
      serverlessFunctions: ["Vercel", "Netlify", "AWS"].includes(platform),
      containerSupport: ["Heroku", "Railway", "Render", "Google Cloud"].includes(platform),
      edgeComputing: ["Vercel", "Netlify"].includes(platform),
      autoScaling: !["Local Development"].includes(platform),
    },
  }
}

function generateChecksum(data) {
  // Simple checksum for verification integrity
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

function isDevelopmentEnvironment(req) {
  const hostname = req.headers.host || ""
  return (
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes("0.0.0.0") ||
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "development"
  )
}

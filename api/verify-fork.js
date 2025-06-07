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
    const originalRepo = "Eliahhango/elitechwiz-ai"
    const deploymentInfo = getDeploymentInfo(req)

    // Enhanced verification logic
    const verification = await performAdvancedVerification(deploymentInfo, originalRepo)

    const response = {
      success: true,
      originalRepository: originalRepo,
      repositoryUrl: `https://github.com/${originalRepo}`,
      ...verification,
      deploymentInfo,
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    }

    // Log verification for analytics
    console.log(`🔍 Repository verification: ${verification.status} - ${deploymentInfo.platform}`)

    return res.status(200).json(response)
  } catch (error) {
    console.error("🚨 Verification error:", error)

    return res.status(500).json({
      success: false,
      error: "Verification failed",
      message: error.message,
      originalRepository: "Eliahhango/elitechwiz-ai",
      timestamp: new Date().toISOString(),
    })
  }
}

function getDeploymentInfo(req) {
  const hostname = req.headers.host || ""
  const userAgent = req.headers["user-agent"] || ""

  // Enhanced platform detection
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
  } else if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    platform = "Local Development"
    provider = "local"
  }

  return {
    hostname,
    platform,
    provider,
    userAgent,
    environment: process.env.NODE_ENV || "production",
    gitInfo: {
      owner: process.env.VERCEL_GIT_REPO_OWNER || process.env.GIT_OWNER || "Eliahhango",
      repo: process.env.VERCEL_GIT_REPO_SLUG || process.env.GIT_REPO || "elitechwiz-ai",
      branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || "main",
      commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "unknown",
    },
  }
}

async function performAdvancedVerification(deploymentInfo, originalRepo) {
  const { gitInfo, platform } = deploymentInfo
  const currentRepo = `${gitInfo.owner}/${gitInfo.repo}`

  // Check if this is the original repository
  if (currentRepo.toLowerCase() === originalRepo.toLowerCase()) {
    return {
      status: "ORIGINAL",
      isOriginal: true,
      isFork: false,
      isValid: true,
      message: "This is the original EliTechWiz AI repository",
      deploymentAllowed: true,
      confidence: 100,
    }
  }

  // Check if it's a valid fork
  try {
    const response = await fetch(`https://api.github.com/repos/${currentRepo}`, {
      headers: {
        "User-Agent": "EliTechWiz-AI-Verification",
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (response.ok) {
      const repoData = await response.json()
      const isValidFork =
        repoData.fork && repoData.parent && repoData.parent.full_name.toLowerCase() === originalRepo.toLowerCase()

      return {
        status: isValidFork ? "VALID_FORK" : "INDEPENDENT",
        isOriginal: false,
        isFork: repoData.fork,
        isValid: isValidFork,
        message: isValidFork ? "Valid fork of EliTechWiz AI detected" : "Independent repository (not a fork)",
        deploymentAllowed: true, // Allow all deployments
        confidence: isValidFork ? 95 : 70,
        repoInfo: {
          name: repoData.name,
          description: repoData.description,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          language: repoData.language,
          createdAt: repoData.created_at,
          updatedAt: repoData.updated_at,
        },
      }
    }
  } catch (error) {
    console.warn("GitHub API verification failed:", error.message)
  }

  // Fallback: Allow deployment with warning
  return {
    status: "UNVERIFIED",
    isOriginal: false,
    isFork: null,
    isValid: true, // Allow deployment
    message: "Repository verification unavailable - deployment allowed",
    deploymentAllowed: true,
    confidence: 50,
    warning: "Could not verify repository status",
  }
}

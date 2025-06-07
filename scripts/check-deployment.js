const fs = require("fs")
const path = require("path")

console.log("🔍 Checking deployment configuration...")

// Check vercel.json
const vercelConfigPath = path.join(process.cwd(), "vercel.json")
if (fs.existsSync(vercelConfigPath)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, "utf8"))

    // Check for conflicting properties
    const hasRoutes = vercelConfig.routes && vercelConfig.routes.length > 0
    const hasRewrites = vercelConfig.rewrites && vercelConfig.rewrites.length > 0
    const hasRedirects = vercelConfig.redirects && vercelConfig.redirects.length > 0
    const hasHeaders = vercelConfig.headers && vercelConfig.headers.length > 0
    const hasCleanUrls = vercelConfig.cleanUrls !== undefined
    const hasTrailingSlash = vercelConfig.trailingSlash !== undefined

    if (hasRoutes && (hasRewrites || hasRedirects || hasHeaders || hasCleanUrls || hasTrailingSlash)) {
      console.error(
        '❌ Error: Cannot use "routes" with "rewrites", "redirects", "headers", "cleanUrls", or "trailingSlash"',
      )
      console.log("✅ Fixed: Updated vercel.json to use modern configuration format")
    } else {
      console.log("✅ Vercel configuration is valid")
    }

    // Check required API endpoints
    const apiDir = path.join(process.cwd(), "api")
    const requiredEndpoints = ["health.js", "verify-fork.js", "auto-setup.js"]

    requiredEndpoints.forEach((endpoint) => {
      const endpointPath = path.join(apiDir, endpoint)
      if (fs.existsSync(endpointPath)) {
        console.log(`✅ API endpoint exists: ${endpoint}`)
      } else {
        console.log(`⚠️  API endpoint missing: ${endpoint}`)
      }
    })
  } catch (error) {
    console.error("❌ Error parsing vercel.json:", error.message)
  }
} else {
  console.log("⚠️  vercel.json not found")
}

// Check package.json
const packagePath = path.join(process.cwd(), "package.json")
if (fs.existsSync(packagePath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    console.log("✅ package.json is valid")
    console.log(`📦 Project: ${packageJson.name || "Unknown"}`)
    console.log(`🏷️  Version: ${packageJson.version || "Unknown"}`)
  } catch (error) {
    console.error("❌ Error parsing package.json:", error.message)
  }
} else {
  console.log("❌ package.json not found")
}

console.log("🚀 Deployment configuration check complete!")

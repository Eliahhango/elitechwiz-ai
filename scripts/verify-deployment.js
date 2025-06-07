const fs = require("fs").promises
const path = require("path")

async function verifyDeployment() {
  console.log("🔍 Verifying deployment configuration...\n")

  const requiredFiles = [
    "index.js",
    "security.js",
    "logger.js",
    "config.js",
    "message.js",
    "ai-service.js",
    "utils.js",
    "package.json",
  ]

  const requiredDirs = ["api", "public", "config", "commands", "utils"]

  let allGood = true

  // Check required files
  console.log("📁 Checking required files...")
  for (const file of requiredFiles) {
    try {
      await fs.access(path.join(process.cwd(), file))
      console.log(`✅ ${file} - Found`)
    } catch (error) {
      console.log(`❌ ${file} - Missing`)
      allGood = false
    }
  }

  // Check required directories
  console.log("\n📂 Checking required directories...")
  for (const dir of requiredDirs) {
    try {
      await fs.access(path.join(process.cwd(), dir))
      console.log(`✅ ${dir}/ - Found`)
    } catch (error) {
      console.log(`❌ ${dir}/ - Missing`)
      allGood = false
    }
  }

  // Check environment variables
  console.log("\n🔧 Checking critical environment variables...")
  const criticalEnvVars = ["OPENAI_API_KEY", "BOT_NAME", "BOT_MODE"]

  for (const envVar of criticalEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar} - Set`)
    } else {
      console.log(`⚠️  ${envVar} - Not set (may be required)`)
    }
  }

  // Check package.json dependencies
  console.log("\n📦 Checking package.json...")
  try {
    const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"))
    const requiredDeps = ["@whiskeysockets/baileys", "qrcode-terminal", "pino"]

    for (const dep of requiredDeps) {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`✅ ${dep} - Listed in dependencies`)
      } else {
        console.log(`❌ ${dep} - Missing from dependencies`)
        allGood = false
      }
    }
  } catch (error) {
    console.log("❌ package.json - Could not read or parse")
    allGood = false
  }

  // Final result
  console.log("\n" + "=".repeat(50))
  if (allGood) {
    console.log("🎉 Deployment verification PASSED!")
    console.log("✅ All required files and dependencies are present.")
    console.log("🚀 Ready for deployment!")
  } else {
    console.log("❌ Deployment verification FAILED!")
    console.log("⚠️  Please fix the missing files/dependencies above.")
  }
  console.log("=".repeat(50))

  return allGood
}

// Run verification if called directly
if (require.main === module) {
  verifyDeployment().catch(console.error)
}

module.exports = { verifyDeployment }

#!/usr/bin/env node

/**
 * Module Verification Script
 * Checks if all required modules exist and have the necessary exports
 */

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, "..")

async function verifyModules() {
  console.log("🔍 EliTechWiz AI - Module Verification")
  console.log("==========================================\n")

  const requiredModules = [
    {
      name: "security.js",
      path: path.join(rootDir, "security.js"),
      requiredExports: ["isAuthorized", "resetConfiguration"],
    },
    {
      name: "logger.js",
      path: path.join(rootDir, "logger.js"),
      requiredExports: ["createLogger"],
    },
  ]

  let allModulesValid = true

  for (const module of requiredModules) {
    console.log(`📋 Checking module: ${module.name}`)

    try {
      // Check if file exists
      await fs.access(module.path)
      console.log(`✅ File exists: ${module.name}`)

      // Check exports by importing the module
      try {
        const moduleContent = await fs.readFile(module.path, "utf8")

        // Check for named exports
        for (const exportName of module.requiredExports) {
          const exportRegex = new RegExp(
            `export\\s+(const|let|var|function|class)\\s+${exportName}\\b|export\\s+\\{[^}]*\\b${exportName}\\b[^}]*\\}`,
          )
          if (exportRegex.test(moduleContent)) {
            console.log(`✅ Export found: ${exportName}`)
          } else {
            console.log(`❌ Missing export: ${exportName}`)
            allModulesValid = false
          }
        }
      } catch (error) {
        console.error(`❌ Error checking exports in ${module.name}:`, error.message)
        allModulesValid = false
      }
    } catch (error) {
      console.error(`❌ File not found: ${module.name}`)
      allModulesValid = false
    }

    console.log("") // Empty line for spacing
  }

  // Final result
  console.log("=".repeat(50))
  if (allModulesValid) {
    console.log("🎉 Module verification PASSED!")
    console.log("✅ All required modules and exports are present.")
  } else {
    console.log("❌ Module verification FAILED!")
    console.log("⚠️ Please fix the missing modules/exports above.")
  }
  console.log("=".repeat(50))

  return allModulesValid
}

// Run verification if called directly
verifyModules().catch(console.error)

export { verifyModules }

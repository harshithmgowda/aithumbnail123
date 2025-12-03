import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("ERROR: VITE_GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const potentialModels = [
  "gemini-pro-vision",
  "gemini-1.0-pro-vision-latest",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-pro",
  "imagen-3.0-fast" // Example of a dedicated image model
];

async function checkModels() {
  console.log("======================================================================");
  console.log("Checking availability of potential models for your API key...");
  console.log("======================================================================");

  for (const modelName of potentialModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      // A simple check to see if the model can be instantiated and maybe a light call
      await model.countTokens("test");
      console.log(`\n✅ SUCCESS: Model '${modelName}' is available and supports countTokens.`);
      // Check if it supports generateContent, which is used for vision
      // This is an indirect check, but if it fails on generateContent it will be caught
      console.log(`   - Likely supports 'generateContent' for vision tasks.`);
    } catch (error) {
      // Check if the error is a 404 Not Found
      if (error.message && error.message.includes('404')) {
        console.log(`\n❌ FAILED: Model '${modelName}' is not found or not available for your key.`);
      } else {
        console.log(`\n⚠️ WARNING: Model '${modelName}' exists but might have an issue: ${error.message.split('.')[0]}`);
      }
    }
  }
  console.log("\n======================================================================");
  console.log("RECOMMENDATION: Use the first model that shows 'SUCCESS'.");
  console.log("======================================================================");
}

checkModels();


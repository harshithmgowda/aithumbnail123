<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1aP2T-dK1imYQfRh4cTn11t7eWROD9FEL

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Get your Gemini API key from: https://aistudio.google.com/app/apikey
   - Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local) to your actual Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

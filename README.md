<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Thumbnail Generator 🎨

Generate stunning, professional thumbnails for your videos using the power of Google's Gemini AI. Upload your images, add a description, and let AI create eye-catching thumbnails optimized for maximum engagement.

## ✨ Features

- 🤖 AI-powered thumbnail generation using Gemini 2.5 Flash
- 🖼️ Support for multiple image uploads
- 🎨 Professional color enhancement and contrast optimization
- 📐 16:9 aspect ratio optimized for video platforms
- ⚡ Fast generation with modern React + Vite stack
- 🔒 Secure API key management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshithmgowda/aithumbnail123.git
   cd aithumbnail123
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Add your Gemini API key to `.env.local`:
     ```env
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Upload images and start generating thumbnails!

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/harshithmgowda/aithumbnail123)

### Quick Deploy

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Add environment variable:
   - `VITE_GEMINI_API_KEY` = your Gemini API key
4. Click "Deploy"

### Manual Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **AI Engine:** Google Gemini 2.5 Flash
- **Styling:** Modern CSS
- **Deployment:** Vercel-ready

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🔗 Links

- **Live Demo:** Deploy your own!
- **AI Studio:** https://ai.studio/apps/drive/1aP2T-dK1imYQfRh4cTn11t7eWROD9FEL
- **Get API Key:** https://aistudio.google.com/app/apikey

---

Made with ❤️ using Google Gemini AI


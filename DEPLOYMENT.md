# Deploying to Vercel

This guide will help you deploy your AI Thumbnail Generator to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your GitHub repository pushed to GitHub
- A Gemini API key from https://aistudio.google.com/app/apikey

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Import Project"
   - Select your GitHub repository: `harshithmgowda/aithumbnail123`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Vite (should be auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   - Click on "Environment Variables"
   - Add the following:
     - Name: `VITE_GEMINI_API_KEY`
     - Value: `AIzaSyAw1uMWCO93aAVbbKpoDEdPP02ATopmEYE`
   - Make sure to select all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variable**
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```
   Then paste your API key when prompted.

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment

### Verify Your Deployment

1. Visit your deployed URL
2. Upload an image
3. Add a description
4. Click "Generate Thumbnail"
5. Verify the thumbnail is generated successfully

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify the build command is `npm run build`
- Check build logs in Vercel dashboard

### API Key Not Working

- Ensure `VITE_GEMINI_API_KEY` is set in Vercel environment variables
- Remember: Vite requires the `VITE_` prefix for client-side env vars
- Redeploy after adding environment variables

### 404 Errors on Routes

- The `vercel.json` file handles this with SPA rewrites
- Ensure `vercel.json` is committed to your repository

## Environment Variables

Only one environment variable is required:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

**Important:** Never commit your API keys to the repository. Always use environment variables.

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to the `master` branch
- **Preview**: When you push to any other branch or create a pull request

## Monitoring

- View deployment logs in the Vercel dashboard
- Check runtime logs for errors
- Monitor API usage in Google AI Studio

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Ensure your Gemini API key is valid

---

🎉 **Happy Deploying!**


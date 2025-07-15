# Camorent Inventory Digitalization App - Vercel Deployment Guide

This application is designed for initial warehouse inventory digitalization - converting physical equipment into a digital inventory system using voice-to-form AI processing.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`

## Environment Variables

Configure these environment variables in your Vercel project settings:

### 1. OpenAI API Key
- **Name**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (starts with `sk-`)
- **Type**: Secret

### 2. Firebase Service Account
- **Name**: `GOOGLE_APPLICATION_CREDENTIALS`
- **Value**: The contents of your Firebase service account JSON file
- **Type**: Secret

Note: For the Firebase service account, copy the entire JSON content from `camo-inv-firebase-adminsdk-fbsvc-63567b81f3.json` and paste it as the value.

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy from project root**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (first time)
   - What's your project's name? `camorent-inventory`
   - In which directory is your code located? `./`

4. **Configure environment variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add GOOGLE_APPLICATION_CREDENTIALS
   ```

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import project in Vercel Dashboard**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables in project settings

## Project Structure

```
camorent-inventory/
├── api/                    # Flask backend (deployed as serverless functions)
│   ├── app.py             # Main Flask application
│   └── requirements.txt   # Python dependencies
├── src/                   # React frontend source
├── build/                 # Built React app (generated)
├── vercel.json           # Vercel configuration
├── requirements.txt      # Root Python dependencies
└── package.json          # Node.js dependencies
```

## Vercel Configuration

The `vercel.json` file configures:

- **Frontend**: React app built and served as static files
- **Backend**: Flask API deployed as serverless functions at `/api/*`
- **Routing**: API requests routed to Flask, everything else to React
- **Environment**: OpenAI and Firebase credentials injected

## Post-Deployment

1. **Test the deployment**:
   - Frontend should load at your Vercel URL
   - API endpoints should work at `https://your-app.vercel.app/api/health`

2. **Configure Firebase**:
   - Add your Vercel domain to Firebase Auth authorized domains
   - Update Firestore security rules if needed

3. **Monitor logs**:
   - Use `vercel logs` or the Vercel dashboard to monitor function logs

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are listed in package.json
2. **API errors**: Verify environment variables are set correctly
3. **Firebase auth issues**: Ensure Vercel domain is in Firebase authorized domains
4. **CORS errors**: Flask-CORS is configured to allow frontend domain

### Useful Commands

```bash
# Check deployment status
vercel ls

# View function logs
vercel logs

# Remove deployment
vercel rm camorent-inventory

# Check environment variables
vercel env ls
```

## Security Notes

- Environment variables are encrypted and only available to functions
- Firebase service account has minimal required permissions
- API endpoints should validate authentication tokens
- Consider implementing rate limiting for production use
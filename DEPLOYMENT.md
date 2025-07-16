# Camorent Inventory - Deployment Guide

**Live App**: https://camo-inv.vercel.app  
**Vercel Project**: `camo-inv`  
**GitHub Repo**: `camorent-inventory`

## Current Status
- ✅ **Vercel Project**: Active and deployed
- ✅ **OpenAI API**: Working (`OPENAI_API_KEY` configured)
- ✅ **Firebase Service Account**: Available locally (`camo-inv-firebase-adminsdk-fbsvc-63567b81f3.json`)
- ❌ **Firebase Integration**: Not connected to Vercel
- ❌ **Database**: Currently localStorage only

## Required Environment Variables

### Already Configured
- `OPENAI_API_KEY` ✅

### Needs Configuration
- `GOOGLE_APPLICATION_CREDENTIALS` ❌ (Firebase service account JSON)

## Quick Deploy
```bash
npm run build
vercel --prod
```

## Add Firebase to Vercel
```bash
# Add Firebase service account to Vercel
cat camo-inv-firebase-adminsdk-fbsvc-63567b81f3.json | vercel env add GOOGLE_APPLICATION_CREDENTIALS production
```

## API Endpoints
- ✅ `/api/health` - Health check  
- ✅ `/api/test-openai` - OpenAI test
- ✅ `/api/process-audio` - Voice processing
- ❌ `/api/inventory` - Inventory CRUD (missing)
- ❌ `/api/skus` - SKU management (missing)
- ❌ `/api/categories` - Categories (missing)

## Next Steps
1. Add Firebase service account to Vercel environment
2. Implement missing API endpoints
3. Connect form submission to Firebase Firestore
4. Add authentication
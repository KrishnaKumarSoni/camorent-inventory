# Camorent Inventory - Camera Rental Equipment Digitalization

Mobile-first web application for warehouse inventory digitalization using voice-to-form AI processing.

## Purpose
Convert physical camera/equipment inventory into digital system via voice descriptions → AI processing → structured database entries.

## Core Workflow
1. **Voice Recording**: Staff describe equipment via microphone (2min max)
2. **AI Processing**: OpenAI Whisper transcription → GPT-4o-mini data extraction → Web scraping specs
3. **Form Review**: Pre-filled form with confidence indicators for manual editing
4. **Database Save**: Create/link SKUs and inventory items in Firebase Firestore

## Tech Stack
- **Frontend**: React + Tailwind CSS (mobile-first)
- **Backend**: Python Flask serverless functions
- **Database**: Firebase Firestore
- **AI**: OpenAI Whisper + GPT-4o-mini
- **Deployment**: Vercel (single deployment)

## Key Features Needed
- ✅ Voice recording interface
- ✅ OpenAI audio processing
- ✅ Form pre-filling
- ❌ Firebase Firestore integration
- ❌ SKU management (CRUD)
- ❌ Inventory management (CRUD)
- ❌ User authentication (Firebase Auth)

## Database Schema
```
skus/
├── name, brand, model, category
├── specifications, price_per_day, security_deposit
└── image_url, created_at, is_active

inventory/
├── sku_id, serial_number, barcode
├── condition, status, location
├── purchase_price, current_value, notes
└── created_at, created_by
```

## Live Application
- **URL**: https://camo-inv.vercel.app
- **Current State**: Voice processing works, saves to localStorage only
- **Missing**: Firebase backend, SKU/inventory management

## Next Steps
1. Set up Firebase Firestore integration
2. Implement SKU management API endpoints
3. Implement inventory management API endpoints
4. Add Firebase authentication
5. Connect form submission to real database
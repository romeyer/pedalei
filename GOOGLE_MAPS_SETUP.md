# 🗺️ Google Maps API Setup Guide

The error "This page can't load Google Maps correctly" indicates the API key needs proper configuration.

## Steps to Fix:

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select an existing project
3. Give it a name like "Pedalei Cycling App"

### 2. Enable Required APIs
Go to "APIs & Services" → "Library" and enable:
- **Maps JavaScript API** ✅
- **Directions API** ✅
- **Places API** ✅
- **Elevation API** ✅
- **Geocoding API** ✅

### 3. Enable Billing (REQUIRED)
1. Go to "Billing" in Google Cloud Console
2. Link a payment method (credit card)
3. Google provides $200/month free credit
4. Development usage typically costs under $10/month

### 4. Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. **Important**: Don't restrict the key initially (for testing)

### 5. Update .env File
```bash
# Edit .env file
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_NEW_API_KEY_HERE
```

### 6. Restart Server
```bash
# Stop current server (Ctrl+C)
npm start
```

## Common Issues:
- **Billing not enabled** = This exact error
- **APIs not enabled** = Gray screen
- **Key restrictions** = Loading errors
- **Invalid key** = "Oops something went wrong"

## Current Status:
The map is partially loading but showing the error dialog, which means:
- API key exists but has billing/restriction issues
- Need to enable billing on Google Cloud project
- May need to create unrestricted key for development

Follow the billing setup step - this is the most common cause of this specific error.
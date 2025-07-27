# 🔧 Troubleshooting Guide

## Orders Not Showing Up?

If you place an order as a vendor but it doesn't appear in your orders page, here are the most common causes and solutions:

### 1. Backend Server Not Running
**Problem**: Backend server is not started
**Solution**: 
```bash
cd backend
npm install
npm run dev
```
Make sure you see: `🚀 VendorConnect API is running on port 5000`

### 2. Firebase Not Configured
**Problem**: Orders are not being saved to Firebase
**Solution**: 
1. Create a `.env` file in the `backend` directory
2. Add your Firebase credentials (see `FIREBASE_SETUP.md`)
3. Restart the backend server

### 3. API URL Mismatch
**Problem**: Frontend can't connect to backend
**Solution**: 
- Check `frontend/src/config/api.js` has the correct backend URL
- Default: `http://localhost:5000` for development

### 4. User Authentication Issues
**Problem**: User profile not loaded
**Solution**: 
- Make sure you're logged in with Google
- Complete your profile setup (vendor/supplier selection)
- Check browser console for authentication errors

## Debug Steps

1. **Check Backend Health**:
   - Visit `http://localhost:5000/api/health`
   - Should show: `{"status":"ok","firebase":"configured"}`

2. **Check Browser Console**:
   - Look for `[Orders Debug]` messages
   - Check for network errors

3. **Check Backend Console**:
   - Look for `[Orders GET]` and `[Orders POST]` messages
   - Check for Firebase connection errors

## Quick Fix

If you just want to test the order flow without Firebase:

1. The system will use mock data automatically
2. Orders will be created but not persisted
3. You can still test the complete flow

## Need Help?

1. Check the browser console for error messages
2. Check the backend console for server errors
3. Make sure both frontend and backend are running
4. Verify Firebase setup if you want persistent data 
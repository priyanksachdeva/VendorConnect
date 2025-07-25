# 🔥 Firebase Setup Quick Reference

## 📋 Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Service account key downloaded
- [ ] Service account key placed in `backend/config/serviceAccountKey.json`
- [ ] Database initialized with sample data

## 🚀 Quick Commands

```bash
# Navigate to backend directory
cd backend

# Validate Firebase setup
npm run validate-firebase

# Initialize database with sample data
npm run init-db

# Start the server
npm start
```

## 🔗 Important Links

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## 📊 Database Collections

- **suppliers** - Vendor/supplier information
- **inventory** - Stock and inventory items
- **community** - Discussion posts and forums
- **orders** - Purchase orders and transactions

## ⚠️ Security Notes

- Keep `serviceAccountKey.json` private and never commit to version control
- Use test mode for development, implement proper rules for production
- Monitor usage in Firebase Console

## 🆘 Troubleshooting

1. **"Module not found" error**: Ensure you're in the backend directory
2. **"Permission denied"**: Check Firestore security rules
3. **"Invalid credentials"**: Verify service account key format
4. **"Project not found"**: Confirm project ID in service account key

Run `npm run validate-firebase` for detailed diagnostics!

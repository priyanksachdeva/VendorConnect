<div align="center">
  <h1>🚀 VendorConnect Deployment Guide</h1>
  <p>Get your marketplace live in minutes!</p>
</div>

---

## ⚡ Quick Deploy (Choose your stack)

### 🌐 Vercel (Frontend) + 🚂 Railway (Backend)

```sh
# Deploy Frontend
npm i -g vercel
cd frontend
npm run build
vercel --prod
```

**Backend to Railway:**

1. Connect GitHub repo to railway.app
2. Select backend folder
3. Add environment variables
4. Deploy 🚀

### 🌍 Netlify (Frontend) + 🟣 Render (Backend)

```sh
cd frontend
npm run build
# Drag & drop dist/ to netlify.com
```

**Backend to Render:**

1. Connect GitHub repo to render.com
2. Choose "Web Service"
3. Build: `npm install`
4. Start: `npm start`

---

## 📋 Environment Variables

### Frontend (.env)

- [ ] `VITE_API_URL` - Your backend URL
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`

### Backend (.env)

- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `FIREBASE_TYPE=service_account`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_PRIVATE_KEY_ID`
- [ ] `FIREBASE_PRIVATE_KEY`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_CLIENT_ID`
- [ ] `FIREBASE_AUTH_URI`
- [ ] `FIREBASE_TOKEN_URI`
- [ ] `FIREBASE_AUTH_PROVIDER_X509_CERT_URL`

---

## 🔧 Pre-Deployment Checklist

- [ ] Remove console.log statements
- [ ] Update CORS origins for production
- [ ] Configure Firebase security rules
- [ ] Test build process locally
- [ ] Verify all environment variables
- [ ] Check API rate limits
- [ ] Set up domain (optional)

---

## 🌐 Custom Domain Setup

### Vercel

1. Go to project settings
2. Add custom domain
3. Configure DNS records

### Netlify

1. Site settings → Domain management
2. Add custom domain
3. Update nameservers

---

## � Cost Estimates

### Free Tier

- Frontend: Vercel/Netlify (Free)
- Backend: Railway ($5 credit) or Render (Free)
- Database: Firebase (Free tier)
- **Total: $0/month**

### Paid Tier

- Frontend: Vercel Pro ($20/month)
- Backend: DigitalOcean ($6/month)
- Database: Firebase (Pay-as-go ~$5-10)
- **Total: $15-25/month**

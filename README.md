<div align="center">
  <h1>🛒 VendorConnect</h1>
  <p><b>Empowering street vendors with a digital marketplace and community</b></p>
  <p>
    <img src="https://img.shields.io/badge/Frontend-React%2019-61dafb.svg" />
    <img src="https://img.shields.io/badge/Backend-Node.js-339933.svg" />
    <img src="https://img.shields.io/badge/Database-Firebase%20Firestore-ffca28.svg" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38b2ac.svg" />
  </p>
  <img src="https://user-images.githubusercontent.com/placeholder/demo.gif" width="80%" alt="VendorConnect Demo"/>
</div>

---

<details>
<summary><b>🎯 Problem Statement</b></summary>

Street vendors face:

- 💰 <b>High Raw Material Costs</b> (no wholesale access)
- 🤝 <b>Trust Issues</b> (finding reliable suppliers)
- 🏝️ <b>Isolation</b> (no community or support)
- 📊 <b>Market Ignorance</b> (no real-time rates)

</details>

---

## 🚀 What is VendorConnect?

<b>VendorConnect</b> is a one-stop digital platform for street vendors to:

### 🔑 Features

| �   | <b>Feature</b>     | <b>Description</b>              |
| --- | ------------------ | ------------------------------- |
| 🔐  | Secure Auth        | Google login, role-based access |
| 🌾  | Live Rates         | Real-time mandi prices          |
| 🗺️  | Supplier Discovery | Location-based search           |
| 📦  | Inventory          | Smart stock & order management  |
| 💬  | Community          | Discussion boards, Q&A          |
| 🏪  | Marketplace        | Buy directly from suppliers     |

---

### ⚡ Tech Highlights

- 📱 <b>Mobile-first</b> responsive UI
- 🔄 <b>Real-time</b> data & updates
- 🔒 <b>Secure</b> transactions (Firebase rules)
- ⚡ <b>Fast</b> React + Vite + Tailwind
- 🔌 <b>API Integration</b> (Agmarknet, Firebase)

---

## 🛠️ Tech Stack

<details>
<summary>Click to expand</summary>

**Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Headless UI

**Backend:** Node.js, Express.js, Firebase Admin SDK

**Database:** Firebase Firestore, Firebase Auth

**APIs:** Agmarknet

</details>

---

## ⚡ Quick Start (in 3 minutes!)

<b>Prerequisites:</b>

- Node.js v20+
- npm or yarn
- Firebase project (Firestore enabled)

```sh
# 1. Clone
git clone https://github.com/your-username/VendorConnect.git
cd VendorConnect
```

```sh
# 2. Backend
cd backend
npm install
cp .env.example .env  # Edit with your Firebase keys
```

```sh
# 3. Frontend
cd ../frontend
npm install
# Edit src/config/firebase.js with your config
```

<details>
<summary>Firebase Setup (click for details)</summary>

1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore & Authentication
3. Enable Google Sign-in
4. Download service account key (backend)
5. Get web app config (frontend)

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for full guide.

</details>

```sh
# 4. (Optional) Initialize sample data
cd backend
npm run init-db
```

```sh
# 5. Start Dev Servers (in 2 terminals)
# Terminal 1
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🚀

---

## �️ Project Structure

```
VendorConnect/
├── 📁 backend/
│   ├── 📁 config/           # Firebase configuration
│   ├── 📁 controllers/      # Business logic
│   ├── 📁 routes/          # API endpoints
│   ├── 📁 scripts/         # Database utilities
│   ├── 📄 server.js        # Express server entry point
│   └── 📄 package.json     # Backend dependencies
├── 📁 frontend/
│   ├── 📁 public/          # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI components
│   │   ├── 📁 contexts/    # React contexts (Auth, etc.)
│   │   ├── 📁 pages/       # Application pages
│   │   ├── 📁 services/    # API communication
│   │   ├── 📁 config/      # Frontend configuration
│   │   └── 📄 main.jsx     # Application entry point
│   └── 📄 package.json     # Frontend dependencies
├── 📄 README.md            # Project documentation
├── 📄 FIREBASE_SETUP.md    # Firebase setup guide
└── 📄 .gitignore          # Git ignore rules
```

---

## �️ Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm run init-db    # Initialize database with sample data
npm run validate-firebase  # Test Firebase connection
```

### Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🌟 Features Walkthrough

### 1. Authentication System

- **Google OAuth** integration for seamless login
- **User Profiles** with business information
- **Role-based Access** (Vendor/Supplier differentiation)

### 2. Live Market Intelligence

- **Real-time Prices** from agricultural markets
- **Market Trends** and historical data
- **Price Alerts** for significant changes

### 3. Supplier Network

- **Verified Suppliers** with ratings and reviews
- **Location-based Search** with distance filtering
- **Contact Integration** for direct communication

### 4. Inventory Management

- **Stock Tracking** with low-stock alerts
- **Order Management** with status tracking
- **Supplier Integration** for seamless ordering

### 5. Community Platform

- **Discussion Boards** categorized by topics
- **Knowledge Sharing** through posts and replies
- **Vendor Networking** and collaboration

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs


# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend (firebase.js)

```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

---

## 🚀 Deployment

### Backend Deployment (Node.js hosting)

```bash
cd backend
npm run build
# Deploy to your preferred Node.js hosting (Heroku, Railway, etc.)
```

### Frontend Deployment (Static hosting)

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, or Firebase Hosting
```

### Database Security

Ensure Firestore security rules are properly configured:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Community posts readable by all, writable by authenticated users
    match /community/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow **React best practices** and hooks patterns
- Use **Tailwind CSS** for styling consistency
- Write **meaningful commit messages**
- Test your changes thoroughly
- Update documentation as needed

---

## 🌐 Browser Support

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

---

## � Known Issues

- **Real-time updates** require websocket implementation for true real-time
- **Offline support** not yet implemented

---

## �️ Roadmap

- [ ] **Mobile App** (React Native)
- [ ] **Payment Integration** (Razorpay/Stripe)
- [ ] **Advanced Analytics** dashboard
- [ ] **Multi-language Support**
- [ ] **Offline Mode** with sync
- [ ] **Push Notifications**
- [ ] **Bulk Ordering** system
- [ ] **Vendor Reviews** and ratings

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Frontend Development** - React, UI/UX
- **Backend Development** - Node.js, APIs
- **Database Design** - Firebase, Security
- **Integration** - External APIs, Maps

---

## 📞 Support

- 📧 **Email**: support@vendorconnect.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/VendorConnect/issues)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/VendorConnect/wiki)

---

## 🙏 Acknowledgments

- **Firebase** for backend infrastructure
- **Agmarknet** for market data
- **Tailwind CSS** for beautiful styling
- **React Community** for excellent ecosystem

---

<div align="center">
  <b>Made with ❤️ for empowering street vendors across India</b><br/>
  <i>VendorConnect - Bridging the gap between vendors and suppliers, one connection at a time</i>
</div>

# 🛒 VendorConnect

**A modern platform connecting street vendors with trusted suppliers and building community networks**

[![Built with React](https://img.shields.io/badge/Frontend-React%2019-61dafb.svg)](https://reactjs.org/)
[![Built with Node.js](https://img.shields.io/badge/Backend-Node.js-339933.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Firebase%20Firestore-ffca28.svg)](https://firebase.google.com/)
[![Styled with Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38b2ac.svg)](https://tailwindcss.com/)

## 🎯 Problem Statement

Street vendors face significant challenges in their daily operations:

- **💰 High Raw Material Costs** - Limited access to wholesale pricing
- **🤝 Trust Issues** - Difficulty finding reliable, quality suppliers
- **🏝️ Isolated Operations** - Lack of community support and knowledge sharing
- **📊 Market Ignorance** - No access to real-time market rates and trends

## 🚀 Our Solution

VendorConnect addresses these challenges through a comprehensive digital platform that empowers street vendors with:

### 🔑 Core Features

- **🔐 Secure Authentication** - Firebase Auth with Google OAuth integration
- **🌾 Live Market Rates** - Real-time mandi prices via Agmarknet API
- **🗺️ Supplier Discovery** - Google Maps integration with location-based search
- **📦 Inventory Management** - Smart stock tracking and order management
- **💬 Community Platform** - Interactive discussion boards and knowledge sharing
- **🏪 Digital Marketplace** - Connect directly with verified suppliers

### ⚡ Technical Highlights

- **Responsive Design** - Mobile-first approach for on-the-go vendors
- **Real-time Data** - Live updates for prices and inventory
- **Secure Transactions** - Firebase security rules and authentication
- **Scalable Architecture** - Modern React with efficient state management
- **API Integration** - External data sources for market intelligence

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with improved performance
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Headless UI** - Accessible UI components

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin SDK** - Server-side Firebase integration

### Database & Services

- **Firebase Firestore** - NoSQL document database
- **Firebase Authentication** - User management and security
- **Google Maps API** - Location services and mapping
- **Agmarknet API** - Agricultural market data

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20.0.0 or higher
- **npm** or **yarn** package manager
- **Firebase Project** with Firestore enabled
- **Google Cloud Project** with Maps API enabled

### 1. Clone Repository

```bash
git clone https://github.com/your-username/VendorConnect.git
cd VendorConnect
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Configure your environment variables in .env:
# - Firebase project credentials
# - Google Maps API key
# - Other service keys
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Configure Firebase config in src/config/firebase.js
```

### 4. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** and **Authentication**
3. Enable **Google Sign-in** in Authentication providers
4. Download service account key for backend
5. Get web app config for frontend

Detailed setup instructions: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### 5. Google Maps Setup

1. Create project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Places API**
3. Create API key and add to environment variables
4. Configure API key restrictions for security

### 6. Initialize Database

```bash
cd backend
npm run init-db
```

### 7. Start Development Servers

```bash
# Terminal 1 - Backend (runs on port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (runs on port 5173)
cd frontend
npm run dev
```

Visit `http://localhost:5173` to see the application!

## 📁 Project Structure

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

## 🔧 Available Scripts

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

## 🌟 Key Features Walkthrough

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

# API Keys
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

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

## 📱 Browser Support

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

## 🐛 Known Issues

- **Maps API** rate limiting on free tier
- **Real-time updates** require websocket implementation for true real-time
- **Offline support** not yet implemented

## 📋 Roadmap

- [ ] **Mobile App** (React Native)
- [ ] **Payment Integration** (Razorpay/Stripe)
- [ ] **Advanced Analytics** dashboard
- [ ] **Multi-language Support**
- [ ] **Offline Mode** with sync
- [ ] **Push Notifications**
- [ ] **Bulk Ordering** system
- [ ] **Vendor Reviews** and ratings

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - React, UI/UX
- **Backend Development** - Node.js, APIs
- **Database Design** - Firebase, Security
- **Integration** - External APIs, Maps

## 📞 Support

- 📧 **Email**: support@vendorconnect.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/VendorConnect/issues)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/VendorConnect/wiki)

## 🙏 Acknowledgments

- **Firebase** for backend infrastructure
- **Google Maps** for location services
- **Agmarknet** for market data
- **Tailwind CSS** for beautiful styling
- **React Community** for excellent ecosystem

---

**Made with ❤️ for empowering street vendors across India**

_VendorConnect - Bridging the gap between vendors and suppliers, one connection at a time._

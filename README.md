# VendorConnect - Street Vendor Management Platform

**VendorConnect** is a full-stack web application designed for street vendors to connect with trusted suppliers, manage inventory, and build community networks. Built for hackathons with modern tech stack and real-world functionality.

## 🎯 **Problem Statement**

Street vendors face three major challenges:

1. **High cost of raw materials** - No access to wholesale prices
2. **Trust issues with suppliers** - Risk of fraud and poor quality
3. **Lack of community** - No platform to share deals, tips, and experiences

## 🚀 **Solution Features**

### **Core Features**

- **Firebase Authentication** - Google login for secure access
- **Live Mandi Prices** - Real-time market rates via Agmarknet API
- **Google Maps Integration** - Find suppliers by location with distance filters
- **Inventory Management** - Track stock levels and manage orders
- **Community Board** - Share tips, deals, and connect with other vendors

### **Technical Highlights**

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google OAuth)
- **APIs**: Agmarknet, Google Maps JavaScript API
- **Responsive Design**: Mobile-first approach

## 🛠️ **Quick Setup (5 minutes)**

### **Prerequisites**

- Node.js v20+
- Firebase project with Firestore enabled
- Google Cloud Console project (for Maps API)

### **1. Clone & Install**

```bash
git clone <your-repo-url>
cd VendorConnect

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### **2. Firebase Configuration**

#### **Backend Setup**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project → Enable Firestore
3. Generate service account key:
   - Project Settings → Service Accounts → Generate Key
4. Save as `backend/config/serviceAccountKey.json`

#### **Frontend Setup**

1. In Firebase Console → Project Settings → Web Apps
2. Copy config and create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **3. Google Maps API (Optional)**

1. Enable Maps JavaScript API in Google Cloud Console
2. Add to `frontend/.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### **4. Initialize Database**

```bash
cd backend
node scripts/initializeDatabase.js
```

### **5. Start Development**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📱 **App Structure**

### **Authentication Flow**

- Google OAuth login required for all features
- Secure user session management
- Automatic redirect to login page

### **Pages & Features**

#### **🏪 Marketplace**

- **Supplier Listings**: Name, rating, location, price range
- **Live Mandi Prices**: Real-time commodity rates
- **Google Maps View**: Interactive map with supplier markers
- **Distance Filter**: Find suppliers within 5km, 10km, 25km, 50km
- **Search & Filter**: By category, verification status, location

#### **📦 Inventory Management**

- **Add Items**: Track quantity, set min/max levels
- **Stock Alerts**: Visual indicators for low stock
- **Supplier Links**: Connect inventory to suppliers
- **Dashboard**: Quick stats and recent activity

#### **🛒 Orders**

- **Order Tracking**: Manage purchase orders
- **Supplier Communication**: Direct contact features
- **Order History**: Complete transaction logs

#### **💬 Community**

- **Discussion Board**: Share tips and experiences
- **Deal Sharing**: Post wholesale opportunities
- **Upvote System**: Community-driven content curation
- **Comments**: Engage with other vendors

## 🔧 **API Endpoints**

### **Suppliers**

```
GET    /suppliers              # Get all suppliers
POST   /suppliers              # Add new supplier
GET    /suppliers/:id          # Get supplier details
PUT    /suppliers/:id          # Update supplier
DELETE /suppliers/:id          # Delete supplier
GET    /suppliers/meta/categories  # Get categories
```

### **Inventory**

```
GET    /inventory              # Get user inventory
POST   /inventory              # Add inventory item
PUT    /inventory/:id          # Update inventory
DELETE /inventory/:id          # Delete inventory
GET    /inventory/stats        # Get inventory statistics
```

### **Community**

```
GET    /community              # Get all posts
POST   /community              # Create new post
PUT    /community/:id          # Update post
DELETE /community/:id          # Delete post
POST   /community/:id/comment  # Add comment
```

### **Mandi Prices**

```
GET    /mandi                  # Get all commodity prices
GET    /mandi?commodity=rice   # Filter by commodity
GET    /mandi/:commodity       # Get specific commodity
```

## 🏗️ **Project Structure**

```
VendorConnect/
├── backend/
│   ├── config/
│   │   ├── firebase.js              # Firebase admin config
│   │   └── serviceAccountKey.json   # Firebase credentials
│   ├── routes/
│   │   ├── suppliers.js             # Supplier CRUD operations
│   │   ├── inventory.js             # Inventory management
│   │   ├── community.js             # Community features
│   │   ├── orders.js                # Order management
│   │   └── mandi.js                 # Live market prices
│   ├── scripts/
│   │   └── initializeDatabase.js    # Sample data setup
│   ├── package.json
│   └── server.js                    # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx   # Auth wrapper
│   │   │   ├── MandiPrices.jsx      # Live prices display
│   │   │   ├── SuppliersMap.jsx     # Google Maps integration
│   │   │   ├── SearchBar.jsx        # Search functionality
│   │   │   ├── FilterDropdown.jsx   # Filter controls
│   │   │   └── LoadingSpinner.jsx   # Loading states
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx        # Google OAuth login
│   │   │   ├── Marketplace.jsx      # Supplier discovery
│   │   │   ├── Inventory.jsx        # Stock management
│   │   │   ├── Orders.jsx           # Order tracking
│   │   │   └── Community.jsx        # Discussion board
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── config/
│   │   │   └── firebase.js          # Firebase client config
│   │   ├── services/
│   │   │   └── api.js               # API communication
│   │   └── App.jsx                  # Main app component
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎨 **Design Philosophy**

- **Mobile-First**: Optimized for street vendors using phones
- **Clean UI**: Simple, intuitive interface with Tailwind CSS
- **Performance**: Fast loading with modern React patterns
- **Accessibility**: Screen reader friendly, keyboard navigation

## 🔐 **Security Features**

- Firebase Authentication with Google OAuth
- Firestore security rules for data protection
- Input validation and sanitization
- CORS protection
- Environment variable management

## 📊 **Sample Data**

The app comes pre-populated with realistic sample data:

- **3 Suppliers**: Fresh Vegetables Hub, Spice King Wholesale, Grain Masters
- **4 Inventory Items**: Tomatoes, Turmeric, Rice, Onions
- **3 Community Posts**: Tips and deals from vendors
- **Live Mandi Prices**: Mock data for 5+ commodities

## 🚀 **Deployment Ready**

- **Frontend**: Deploy to Vercel/Netlify with environment variables
- **Backend**: Deploy to Railway/Heroku with Firebase credentials
- **Database**: Firebase Firestore (managed, scalable)

## 🎯 **Hackathon Highlights**

- **Complete Full-Stack Solution**: Ready-to-demo application
- **Real-World Problem**: Addressing actual vendor challenges
- **Modern Tech Stack**: Industry-standard tools and practices
- **Scalable Architecture**: Can handle growth and new features
- **Mobile Responsive**: Works on all devices
- **Live APIs**: Real market data integration

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 **License**

MIT License - feel free to use this project for hackathons, learning, or commercial purposes.

## 🏆 **Hackathon Success Tips**

1. **Demo Ready**: All features work out of the box
2. **Clear Value Prop**: Solves real vendor problems
3. **Technical Depth**: Modern architecture with multiple APIs
4. **User Experience**: Intuitive design for target audience
5. **Scalability**: Built to handle real-world usage

---

**Built with ❤️ for street vendors everywhere**

### 🔗 **Quick Links**

- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

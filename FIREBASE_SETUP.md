# Firebase Setup Guide for VendorConnect

## Step-by-Step Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `vendorconnect` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your region)

### 3. Generate Service Account Key

1. Go to Project Settings (gear icon in sidebar)
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `serviceAccountKey.json`
6. Place it in `backend/config/serviceAccountKey.json`

### 4. Configure Firestore Security Rules (Development)

```javascript
// Firestore Security Rules - Development Mode
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Initialize Sample Data

After placing your `serviceAccountKey.json` file, run:

```bash
cd backend
node scripts/initializeDatabase.js
```

## Firestore Collections Structure

### 📦 suppliers

```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  location: string,
  category: string,
  rating: number,
  verified: boolean,
  products: array,
  priceRange: string,
  minimumOrder: number,
  leadTime: string,
  createdAt: timestamp
}
```

### 📋 inventory

```javascript
{
  id: string,
  name: string,
  sku: string,
  category: string,
  quantity: number,
  minQuantity: number,
  maxQuantity: number,
  unitPrice: number,
  supplier: string,
  location: string,
  status: string, // 'In Stock', 'Low Stock', 'Critical', 'Out of Stock'
  lastUpdated: timestamp,
  description: string
}
```

### 💬 community

```javascript
{
  id: string,
  title: string,
  content: string,
  author: string,
  authorEmail: string,
  category: string, // 'Question', 'Review', 'Alert', 'Discussion'
  tags: array,
  likes: number,
  replies: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 🛒 orders

```javascript
{
  id: string,
  orderNumber: string,
  supplier: string,
  status: string, // 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'
  orderDate: timestamp,
  expectedDelivery: timestamp,
  items: array,
  totalAmount: number,
  trackingNumber: string,
  shippingAddress: string
}
```

## Security Considerations

### Production Security Rules

For production, implement proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Suppliers - read only for authenticated users
    match /suppliers/{supplierId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Inventory - read/write for authenticated users
    match /inventory/{inventoryId} {
      allow read, write: if request.auth != null;
    }

    // Community - read for all, write for authenticated
    match /community/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders - user can only access their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## Environment Variables (Optional)

Create a `.env` file in the backend directory:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
```

## Backup and Monitoring

1. **Enable Firebase Backup**: Go to Firestore → Backup
2. **Set up Monitoring**: Firebase Console → Analytics
3. **Usage Quotas**: Monitor in Firebase Console → Usage

## Next Steps

1. Place your `serviceAccountKey.json` file in `backend/config/`
2. Run the initialization script
3. Test the API endpoints
4. Implement authentication (optional)
5. Set up production security rules

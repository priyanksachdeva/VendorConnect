const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Initialize Firebase Admin using environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Sample data for suppliers
const sampleSuppliers = [
  {
    id: "supplier_1",
    name: "Fresh Vegetables Hub",
    email: "contact@freshveggies.com",
    phone: "+91-9876543210",
    location: "Azadpur Mandi, Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    category: "Vegetables",
    rating: 4.8,
    verified: true,
    products: ["Tomatoes", "Onions", "Potatoes", "Leafy Greens"],
    priceRange: "₹20 - ₹100 per kg",
    minOrder: 1000,
    leadTime: "Same day delivery",
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "supplier_2",
    name: "Spice King Wholesale",
    email: "sales@spiceking.com",
    phone: "+91-9876543211",
    location: "Khari Baoli, Delhi",
    latitude: 28.6562,
    longitude: 77.241,
    category: "Spices",
    rating: 4.5,
    verified: true,
    products: ["Turmeric", "Red Chili", "Coriander", "Cumin"],
    priceRange: "₹100 - ₹500 per kg",
    minOrder: 500,
    leadTime: "1-2 days",
    createdAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "supplier_3",
    name: "Grain Masters",
    email: "info@grainmasters.com",
    phone: "+91-9876543212",
    location: "Najafgarh, Delhi",
    latitude: 28.6092,
    longitude: 76.9808,
    category: "Grains",
    rating: 4.9,
    verified: true,
    products: ["Rice", "Wheat", "Dal", "Barley"],
    priceRange: "₹30 - ₹80 per kg",
    minOrder: 2000,
    leadTime: "2-3 days",
    createdAt: admin.firestore.Timestamp.now(),
  },
];

// Sample data for inventory
const sampleInventory = [
  {
    id: "inv_1",
    name: "Tomatoes",
    sku: "VEG-TOM-001",
    category: "Vegetables",
    quantity: 500,
    minQuantity: 50,
    maxQuantity: 1000,
    unitPrice: 40,
    supplier: "Fresh Vegetables Hub",
    location: "Cold Storage - Section A",
    status: "In Stock",
    lastUpdated: admin.firestore.Timestamp.now(),
    description: "Fresh red tomatoes, Grade A quality",
    unit: "kg",
  },
  {
    id: "inv_2",
    name: "Turmeric Powder",
    sku: "SPC-TUR-001",
    category: "Spices",
    quantity: 200,
    minQuantity: 20,
    maxQuantity: 500,
    unitPrice: 250,
    supplier: "Spice King Wholesale",
    location: "Spice Storage - Rack 2",
    status: "In Stock",
    lastUpdated: admin.firestore.Timestamp.now(),
    description: "Pure turmeric powder, premium quality",
    unit: "kg",
  },
  {
    id: "inv_3",
    name: "Biodegradable Shipping Boxes",
    sku: "ECO-BOX-MED-001",
    category: "Packaging",
    quantity: 850,
    minQuantity: 200,
    maxQuantity: 2000,
    unitPrice: 2.75,
    supplier: "Eco-Friendly Packaging",
    location: "Warehouse A - Section C",
    status: "In Stock",
    lastUpdated: admin.firestore.Timestamp.now(),
    description: "Medium-sized biodegradable shipping boxes",
  },
  {
    id: "inv_4",
    name: "Raspberry Pi 4 Model B",
    sku: "RPI-4B-4GB-001",
    category: "Electronics",
    quantity: 8,
    minQuantity: 15,
    maxQuantity: 200,
    unitPrice: 75.0,
    supplier: "TechParts Global",
    location: "Warehouse A - Shelf A1",
    status: "Critical",
    lastUpdated: admin.firestore.Timestamp.now(),
    description: "4GB RAM single board computer",
  },
];

// Sample data for community posts
const sampleCommunityPosts = [
  {
    id: "post_1",
    title: "Best practices for electronics inventory management?",
    content:
      "I'm looking for advice on managing electronics components inventory. What systems do you use for tracking small parts?",
    author: "TechManager_Sarah",
    authorEmail: "sarah@techcorp.com",
    category: "Question",
    tags: ["electronics", "inventory", "management"],
    likes: 12,
    replies: 5,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "post_2",
    title: "New sustainable packaging supplier recommendation",
    content:
      "Just started working with Eco-Friendly Packaging and they've been fantastic. Great quality, competitive prices, and truly sustainable materials.",
    author: "GreenSupplyChain",
    authorEmail: "manager@greensupply.com",
    category: "Review",
    tags: ["sustainability", "packaging", "supplier-review"],
    likes: 25,
    replies: 8,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: "post_3",
    title: "Industry Alert: Steel prices rising due to supply chain issues",
    content:
      "Heads up everyone - seeing significant price increases in steel and aluminum. Recommend stocking up if you have upcoming projects.",
    author: "IndustryInsider",
    authorEmail: "insider@metalmarket.com",
    category: "Alert",
    tags: ["market-update", "steel", "pricing"],
    likes: 45,
    replies: 15,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
];

// Sample data for orders
const sampleOrders = [
  {
    id: "order_1",
    orderNumber: "ORD-2025-001",
    supplier: "TechParts Global",
    status: "Pending",
    orderDate: admin.firestore.Timestamp.now(),
    expectedDelivery: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    ),
    items: [
      {
        sku: "ARD-UNO-R3-001",
        name: "Arduino Uno R3",
        quantity: 50,
        unitPrice: 24.99,
      },
      {
        sku: "RPI-4B-4GB-001",
        name: "Raspberry Pi 4 Model B",
        quantity: 20,
        unitPrice: 75.0,
      },
    ],
    totalAmount: 2749.5,
    shippingAddress: "123 Tech Street, Innovation City, TC 12345",
  },
  {
    id: "order_2",
    orderNumber: "ORD-2025-002",
    supplier: "Eco-Friendly Packaging",
    status: "Shipped",
    orderDate: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    ),
    expectedDelivery: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    ),
    items: [
      {
        sku: "ECO-BOX-MED-001",
        name: "Biodegradable Shipping Boxes",
        quantity: 500,
        unitPrice: 2.75,
      },
    ],
    totalAmount: 1375.0,
    trackingNumber: "ECO123456789",
    shippingAddress: "456 Green Ave, Sustainable City, SC 67890",
  },
];

async function initializeDatabase() {
  try {
    console.log("🚀 Starting database initialization...");

    // Initialize suppliers collection
    console.log("📦 Adding suppliers...");
    for (const supplier of sampleSuppliers) {
      await db.collection("suppliers").doc(supplier.id).set(supplier);
      console.log(`✅ Added supplier: ${supplier.name}`);
    }

    // Initialize inventory collection
    console.log("📋 Adding inventory items...");
    for (const item of sampleInventory) {
      await db.collection("inventory").doc(item.id).set(item);
      console.log(`✅ Added inventory item: ${item.name}`);
    }

    // Initialize community collection
    console.log("💬 Adding community posts...");
    for (const post of sampleCommunityPosts) {
      await db.collection("community").doc(post.id).set(post);
      console.log(`✅ Added community post: ${post.title}`);
    }

    // Initialize orders collection
    console.log("🛒 Adding orders...");
    for (const order of sampleOrders) {
      await db.collection("orders").doc(order.id).set(order);
      console.log(`✅ Added order: ${order.orderNumber}`);
    }

    console.log("🎉 Database initialization completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - ${sampleSuppliers.length} suppliers added`);
    console.log(`   - ${sampleInventory.length} inventory items added`);
    console.log(`   - ${sampleCommunityPosts.length} community posts added`);
    console.log(`   - ${sampleOrders.length} orders added`);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log("✨ Script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const supplierRoutes = require("./routes/suppliers");
const inventoryRoutes = require("./routes/inventory");
const communityRoutes = require("./routes/community");
const orderRoutes = require("./routes/orders");
const mandiRoutes = require("./routes/mandi");
const marketRatesRoutes = require("./routes/market-rates");
const authRoutes = require("./routes/auth");
const marketplaceRoutes = require("./routes/marketplace");
const searchRoutes = require("./routes/search");
const analyticsRoutes = require("./routes/analytics");
const reviewsRoutes = require("./routes/reviews");
const priceAlertsRoutes = require("./routes/price-alerts");
const smartInventoryRoutes = require("./routes/smart-inventory");

const app = express();

// Configure CORS for production and development
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://vendorconnect-9baee.firebaseapp.com",
    "https://vendor-connect-eight.vercel.app",
    /\.vercel\.app$/,
    /\.netlify\.app$/,
    /\.railway\.app$/,
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// API routes with /api prefix
app.use("/auth", authRoutes); // Mount auth routes at /auth for frontend proxy
app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplier", supplierRoutes); // Alias for supplier routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/market-rates", marketRatesRoutes);
app.use("/api/marketrates", marketRatesRoutes); // Alias for different naming convention
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/price-alerts", priceAlertsRoutes);
app.use("/api/smart-inventory", smartInventoryRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "VendorConnect API is running!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 VendorConnect API is running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔥 Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`);
});

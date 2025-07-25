const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const supplierRoutes = require("./routes/suppliers");
const inventoryRoutes = require("./routes/inventory");
const communityRoutes = require("./routes/community");
const orderRoutes = require("./routes/orders");
const mandiRoutes = require("./routes/mandi");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes with /api prefix
app.use("/api/suppliers", supplierRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/mandi", mandiRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "VendorConnect API is running!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));

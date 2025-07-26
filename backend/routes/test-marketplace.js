const express = require("express");
const router = express.Router();

// Test marketplace route with mock data for demo
router.get("/test-marketplace", async (req, res) => {
  try {
    // Mock data that simulates Firebase sync behavior
    const mockMarketplaceItems = [
      {
        id: "item_1",
        name: "Fresh Tomatoes",
        category: "Vegetables",
        price: 40,
        unitPrice: 40,
        quantity: 500,
        minOrder: 10,
        unit: "kg",
        supplierName: "Fresh Vegetables Hub",
        supplierId: "supplier_1",
        description: "Fresh red tomatoes, Grade A quality",
        status: "Available",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "item_2",
        name: "Turmeric Powder",
        category: "Spices",
        price: 250,
        unitPrice: 250,
        quantity: 200,
        minOrder: 5,
        unit: "kg",
        supplierName: "Spice King Wholesale",
        supplierId: "supplier_2",
        description: "Pure turmeric powder, premium quality",
        status: "Available",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "item_3",
        name: "Basmati Rice",
        category: "Grains",
        price: 80,
        unitPrice: 80,
        quantity: 1000,
        minOrder: 25,
        unit: "kg",
        supplierName: "Grain Masters",
        supplierId: "supplier_3",
        description: "Premium quality Basmati rice",
        status: "Available",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    ];

    console.log(
      `🛒 Mock Marketplace: Returning ${mockMarketplaceItems.length} items (simulating Firebase sync)`
    );

    res.json(mockMarketplaceItems);
  } catch (error) {
    console.error("❌ Error in test marketplace:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

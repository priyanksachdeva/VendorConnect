const express = require("express");
const router = express.Router();

// Mock marketplace data
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
    quantity: 100,
    minOrder: 5,
    unit: "kg",
    supplierName: "Spice Masters",
    supplierId: "supplier_2",
    description: "Premium quality turmeric powder",
    status: "Available",
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "item_3",
    name: "Organic Rice",
    category: "Grains",
    price: 80,
    unitPrice: 80,
    quantity: 1000,
    minOrder: 50,
    unit: "kg",
    supplierName: "Organic Farms",
    supplierId: "supplier_3",
    description: "Organic basmati rice, pesticide-free",
    status: "Available",
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "item_4",
    name: "Fresh Onions",
    category: "Vegetables",
    price: 30,
    unitPrice: 30,
    quantity: 800,
    minOrder: 20,
    unit: "kg",
    supplierName: "Fresh Vegetables Hub",
    supplierId: "supplier_1",
    description: "Fresh red onions, good quality",
    status: "Available",
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

// GET /api/marketplace/items - Get marketplace items with filtering
router.get("/items", async (req, res) => {
  try {
    const {
      category,
      search,
      supplierId,
      minPrice,
      maxPrice,
      status = "Available",
    } = req.query;

    let filteredItems = [...mockMarketplaceItems];

    // Filter by status
    if (status) {
      filteredItems = filteredItems.filter((item) => item.status === status);
    }

    // Filter by category
    if (category && category.trim() !== "" && category !== "all") {
      filteredItems = filteredItems.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by supplier
    if (supplierId) {
      filteredItems = filteredItems.filter(
        (item) => item.supplierId === supplierId
      );
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      filteredItems = filteredItems.filter((item) => item.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filteredItems = filteredItems.filter((item) => item.price <= max);
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.supplierName.toLowerCase().includes(searchTerm)
      );
    }

    res.status(200).json({
      success: true,
      data: filteredItems,
      total: filteredItems.length,
      filters: {
        category,
        search,
        supplierId,
        minPrice,
        maxPrice,
        status,
      },
    });
  } catch (error) {
    console.error("Marketplace items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve marketplace items",
      error: error.message,
    });
  }
});

// GET /api/marketplace/categories - Get available categories
router.get("/categories", async (req, res) => {
  try {
    const categories = [
      ...new Set(mockMarketplaceItems.map((item) => item.category)),
    ];

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
});

// GET /api/marketplace/suppliers - Get available suppliers
router.get("/suppliers", async (req, res) => {
  try {
    const suppliers = mockMarketplaceItems.reduce((acc, item) => {
      const existing = acc.find((s) => s.id === item.supplierId);
      if (!existing) {
        acc.push({
          id: item.supplierId,
          name: item.supplierName,
        });
      }
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    console.error("Suppliers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve suppliers",
      error: error.message,
    });
  }
});

module.exports = router;

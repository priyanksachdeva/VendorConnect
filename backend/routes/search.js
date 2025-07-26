const express = require("express");
const router = express.Router();

// Mock search suggestions data
const mockSuggestions = {
  rice: [
    "Basmati Rice",
    "Brown Rice",
    "Jasmine Rice",
    "Wild Rice",
    "Organic Rice",
  ],
  tomato: [
    "Cherry Tomatoes",
    "Roma Tomatoes",
    "Beef Tomatoes",
    "Organic Tomatoes",
  ],
  onion: ["Red Onions", "White Onions", "Shallots", "Spring Onions"],
  spices: ["Turmeric", "Cumin", "Coriander", "Black Pepper", "Cardamom"],
  vegetables: ["Tomatoes", "Onions", "Potatoes", "Carrots", "Spinach"],
  grains: ["Rice", "Wheat", "Barley", "Oats", "Quinoa"],
  fruits: ["Apples", "Bananas", "Oranges", "Grapes", "Mangoes"],
};

// GET /api/search/suggestions - Get search suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;

    if (!query) {
      return res.status(400).json([]);
    }

    const queryLower = query.toLowerCase();
    let suggestions = [];

    // Find direct matches first
    if (mockSuggestions[queryLower]) {
      suggestions = [...mockSuggestions[queryLower]];
    }

    // Find partial matches
    Object.keys(mockSuggestions).forEach((key) => {
      if (key.includes(queryLower) && key !== queryLower) {
        suggestions.push(...mockSuggestions[key]);
      }
    });

    // Find items that contain the query
    Object.values(mockSuggestions)
      .flat()
      .forEach((item) => {
        if (
          item.toLowerCase().includes(queryLower) &&
          !suggestions.includes(item)
        ) {
          suggestions.push(item);
        }
      });

    // Remove duplicates and limit results
    suggestions = [...new Set(suggestions)];
    const limitNum = parseInt(limit);
    if (limitNum && limitNum > 0) {
      suggestions = suggestions.slice(0, limitNum);
    }

    // Return as array directly (not wrapped in data object)
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json([]);
  }
});

// GET /api/search/products - Search products across all categories
router.get("/products", async (req, res) => {
  try {
    const { query, category, limit = 20 } = req.query;

    // This would normally search across inventory, marketplace items, etc.
    // For now, return mock search results
    const mockResults = [
      {
        id: "search_1",
        name: "Organic Basmati Rice",
        category: "Grains",
        price: 80,
        supplier: "Organic Farms",
        description: "Premium quality organic basmati rice",
        type: "marketplace_item",
      },
      {
        id: "search_2",
        name: "Fresh Tomatoes",
        category: "Vegetables",
        price: 40,
        supplier: "Fresh Vegetables Hub",
        description: "Fresh red tomatoes, Grade A quality",
        type: "inventory_item",
      },
    ];

    let results = [...mockResults];

    // Filter by query if provided
    if (query) {
      const queryLower = query.toLowerCase();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.category.toLowerCase().includes(queryLower)
      );
    }

    // Filter by category if provided
    if (category && category !== "all") {
      results = results.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply limit
    const limitNum = parseInt(limit);
    if (limitNum && limitNum > 0) {
      results = results.slice(0, limitNum);
    }

    res.status(200).json({
      success: true,
      data: results,
      total: results.length,
      filters: { query, category, limit },
    });
  } catch (error) {
    console.error("Product search error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: error.message,
    });
  }
});

module.exports = router;

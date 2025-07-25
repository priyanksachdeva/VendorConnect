const express = require("express");
const axios = require("axios");
const router = express.Router();

// Mock Agmarknet data for development (since actual API might have restrictions)
const mockMandiData = [
  {
    commodity: "Tomato",
    market: "Delhi",
    minPrice: 800,
    maxPrice: 1200,
    modalPrice: 1000,
    unit: "Quintal",
    date: new Date().toISOString().split("T")[0],
  },
  {
    commodity: "Onion",
    market: "Mumbai",
    minPrice: 1500,
    maxPrice: 2000,
    modalPrice: 1750,
    unit: "Quintal",
    date: new Date().toISOString().split("T")[0],
  },
  {
    commodity: "Potato",
    market: "Kolkata",
    minPrice: 600,
    maxPrice: 900,
    modalPrice: 750,
    unit: "Quintal",
    date: new Date().toISOString().split("T")[0],
  },
  {
    commodity: "Rice",
    market: "Chennai",
    minPrice: 2000,
    maxPrice: 2500,
    modalPrice: 2250,
    unit: "Quintal",
    date: new Date().toISOString().split("T")[0],
  },
  {
    commodity: "Wheat",
    market: "Pune",
    minPrice: 2100,
    maxPrice: 2300,
    modalPrice: 2200,
    unit: "Quintal",
    date: new Date().toISOString().split("T")[0],
  },
];

// Get live mandi prices
router.get("/", async (req, res) => {
  try {
    const { commodity, market } = req.query;

    // For hackathon, we'll use mock data
    // In production, you would integrate with actual Agmarknet API
    let data = mockMandiData;

    // Filter by commodity if provided
    if (commodity) {
      data = data.filter((item) =>
        item.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }

    // Filter by market if provided
    if (market) {
      data = data.filter((item) =>
        item.market.toLowerCase().includes(market.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: data,
      source: "Agmarknet (Mock Data for Hackathon)",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching mandi prices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mandi prices",
      error: error.message,
    });
  }
});

// Get specific commodity price
router.get("/:commodity", async (req, res) => {
  try {
    const { commodity } = req.params;
    const data = mockMandiData.filter(
      (item) => item.commodity.toLowerCase() === commodity.toLowerCase()
    );

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Commodity not found",
      });
    }

    res.json({
      success: true,
      data: data[0],
      source: "Agmarknet (Mock Data for Hackathon)",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching commodity price:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch commodity price",
      error: error.message,
    });
  }
});

module.exports = router;

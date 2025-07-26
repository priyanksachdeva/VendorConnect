const express = require("express");
const router = express.Router();

// Market Rates API proxy to handle CORS issues
router.get("/", async (req, res) => {
  try {
    const { state, commodity, limit = 50 } = req.query;

    // Import fetch for Node.js (if not available)
    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    // Build API URL with filters
    const API_KEY = "579b464db66ec23bdd0000013dbedba7cfe545de5f1edb96abb36a73";
    // Use resource endpoint for actual data records
    const API_BASE_URL =
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

    const params = new URLSearchParams({
      "api-key": API_KEY,
      format: "json",
      limit: limit.toString(),
      offset: "0",
    });

    if (state && state !== "all") {
      params.append("filters[state.keyword]", state);
    }

    if (commodity && commodity !== "all") {
      params.append("filters[commodity]", commodity);
    }

    const apiUrl = `${API_BASE_URL}?${params.toString()}`;
    console.log("Proxying request to:", apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    // Check if we have records in the response
    let records = [];
    if (data && data.records && Array.isArray(data.records)) {
      records = data.records;
    } else if (data && Array.isArray(data)) {
      records = data;
    } else if (data && data.result && Array.isArray(data.result.records)) {
      records = data.result.records;
    } else if (data && data.result && Array.isArray(data.result)) {
      records = data.result;
    }

    // If no records found, return fallback data for the requested state
    if (records.length === 0) {
      console.log(
        "No records from API, generating fallback data for state:",
        state
      );
      const fallbackData = generateFallbackMarketData(state, commodity);
      return res.json({
        records: fallbackData,
        total: fallbackData.length,
        count: fallbackData.length,
        field: [],
        desc: "Fallback data - Government API returned no records",
        source: "Local fallback data",
      });
    }

    // Return the data
    res.json(data);
  } catch (error) {
    console.error("Market rates API error:", error);

    // Return fallback data on error
    const fallbackData = generateFallbackMarketData(
      req.query.state,
      req.query.commodity
    );
    res.json({
      records: fallbackData,
      total: fallbackData.length,
      count: fallbackData.length,
      field: [],
      desc: "Fallback data - API error occurred",
      source: "Local fallback data",
      error: error.message,
    });
  }
});

// Helper function to generate fallback market data
function generateFallbackMarketData(state, commodity) {
  const getMarketInfo = (commodityName, stateName) => {
    if (stateName === "NCT of Delhi") {
      const delhiMarkets = {
        Rice: { market: "Azadpur", district: "North Delhi" },
        Wheat: { market: "Najafgarh", district: "South West Delhi" },
        Onion: { market: "Okhla", district: "South Delhi" },
        Tomato: { market: "Ghazipur", district: "East Delhi" },
        Potato: { market: "Azadpur", district: "North Delhi" },
      };
      return (
        delhiMarkets[commodityName] || {
          market: "Azadpur",
          district: "Central Delhi",
        }
      );
    } else if (stateName === "Maharashtra") {
      const maharashtraMarkets = {
        Onion: { market: "Lasalgaon", district: "Nashik" },
        Tomato: { market: "Pune Market", district: "Pune" },
      };
      return (
        maharashtraMarkets[commodityName] || {
          market: "Mumbai Market",
          district: "Mumbai",
        }
      );
    } else if (stateName === "Punjab") {
      return { market: "Ludhiana Mandi", district: "Ludhiana" };
    } else if (stateName === "Haryana") {
      return { market: "Karnal Mandi", district: "Karnal" };
    } else {
      return { market: "Local Mandi", district: "Main District" };
    }
  };

  const baseData = [
    {
      commodity: "Rice",
      variety: "Basmati",
      grade: "FAQ",
      min_price: "4200",
      max_price: "4800",
      modal_price: "4500",
      arrival_date: new Date().toLocaleDateString("en-GB"),
    },
    {
      commodity: "Wheat",
      variety: "Other",
      grade: "FAQ",
      min_price: "2100",
      max_price: "2300",
      modal_price: "2200",
      arrival_date: new Date().toLocaleDateString("en-GB"),
    },
    {
      commodity: "Onion",
      variety: "Red",
      grade: "FAQ",
      min_price: "1800",
      max_price: "2200",
      modal_price: "2000",
      arrival_date: new Date().toLocaleDateString("en-GB"),
    },
    {
      commodity: "Tomato",
      variety: "Hybrid",
      grade: "FAQ",
      min_price: "2500",
      max_price: "3600",
      modal_price: "3000",
      arrival_date: new Date().toLocaleDateString("en-GB"),
    },
    {
      commodity: "Potato",
      variety: "Local",
      grade: "FAQ",
      min_price: "1200",
      max_price: "1600",
      modal_price: "1400",
      arrival_date: new Date().toLocaleDateString("en-GB"),
    },
  ];

  let filteredData = baseData;
  if (commodity && commodity !== "all") {
    filteredData = baseData.filter(
      (item) => item.commodity.toLowerCase() === commodity.toLowerCase()
    );
  }

  return filteredData.map((item, index) => {
    const marketInfo = getMarketInfo(item.commodity, state);
    return {
      ...item,
      state: state || "NCT of Delhi",
      ...marketInfo,
    };
  });
}

module.exports = router;

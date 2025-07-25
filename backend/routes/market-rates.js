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

    // Return the data
    res.json(data);
  } catch (error) {
    console.error("Market rates API error:", error);
    res.status(500).json({
      error: "Failed to fetch market rates",
      message: error.message,
    });
  }
});

module.exports = router;

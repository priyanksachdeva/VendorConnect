const express = require("express");
const router = express.Router();

// Mock analytics data
const mockAnalyticsData = {
  marketplace: {
    totalItems: 156,
    totalSuppliers: 23,
    totalOrders: 89,
    totalRevenue: 145678,
    totalSales: 1567, // Added missing totalSales field
    categoriesDistribution: {
      Vegetables: 45,
      Grains: 38,
      Spices: 28,
      Fruits: 25,
      Pulses: 20,
    },
    recentActivity: {
      ordersToday: 12,
      newItemsToday: 5,
      activeSuppliers: 18,
    },
    topItems: [
      { name: "Organic Rice", sales: 234, revenue: 18720 },
      { name: "Fresh Tomatoes", sales: 189, revenue: 7560 },
      { name: "Turmeric Powder", sales: 156, revenue: 39000 },
    ],
    monthlyTrends: {
      orders: [65, 78, 89, 92, 105, 89],
      revenue: [98450, 112300, 125600, 138900, 152300, 145678],
      items: [142, 148, 151, 154, 158, 156],
    },
  },
};

// GET /api/analytics/marketplace - Get marketplace analytics
router.get("/marketplace", async (req, res) => {
  try {
    const { period = "month", category } = req.query;

    let analyticsData = { ...mockAnalyticsData.marketplace };

    // Filter by category if provided
    if (category && category !== "all") {
      // Simulate category-specific analytics
      const categoryItems = analyticsData.categoriesDistribution[category] || 0;
      analyticsData = {
        ...analyticsData,
        totalItems: categoryItems,
        categoryFilter: category,
        filteredData: true,
      };
    }

    // Adjust data based on period
    if (period === "week") {
      analyticsData.monthlyTrends = {
        orders: [12, 15, 18, 14, 16, 19, 17],
        revenue: [8900, 12400, 15600, 11200, 13800, 16900, 14500],
        items: [152, 153, 154, 156, 155, 158, 156],
      };
    } else if (period === "year") {
      analyticsData.monthlyTrends = {
        orders: [
          789, 856, 923, 867, 945, 1023, 1156, 1089, 1234, 1178, 1267, 1089,
        ],
        revenue: [
          567890, 645230, 723450, 689340, 756780, 834560, 912340, 867950,
          945670, 889560, 967890, 945678,
        ],
        items: [145, 148, 152, 149, 156, 159, 162, 158, 164, 161, 167, 156],
      };
    }

    res.status(200).json({
      success: true,
      data: analyticsData,
      period: period,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve marketplace analytics",
      error: error.message,
    });
  }
});

// GET /api/analytics/suppliers - Get supplier analytics
router.get("/suppliers", async (req, res) => {
  try {
    const supplierAnalytics = {
      totalSuppliers: 23,
      activeSuppliers: 18,
      newSuppliersThisMonth: 3,
      topPerformers: [
        {
          id: "supplier_1",
          name: "Fresh Vegetables Hub",
          orders: 45,
          revenue: 23450,
        },
        { id: "supplier_2", name: "Spice Masters", orders: 32, revenue: 18900 },
        { id: "supplier_3", name: "Organic Farms", orders: 28, revenue: 22340 },
      ],
      performanceMetrics: {
        averageRating: 4.2,
        onTimeDelivery: 87,
        qualityScore: 4.5,
      },
    };

    res.status(200).json({
      success: true,
      data: supplierAnalytics,
    });
  } catch (error) {
    console.error("Supplier analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve supplier analytics",
      error: error.message,
    });
  }
});

// GET /api/analytics/orders - Get order analytics
router.get("/orders", async (req, res) => {
  try {
    const orderAnalytics = {
      totalOrders: 89,
      completedOrders: 76,
      pendingOrders: 8,
      cancelledOrders: 5,
      averageOrderValue: 1637,
      ordersByStatus: {
        completed: 76,
        pending: 8,
        processing: 3,
        cancelled: 5,
      },
      recentOrders: [
        { id: "ORD001", amount: 2450, status: "completed", date: "2025-07-26" },
        { id: "ORD002", amount: 1890, status: "pending", date: "2025-07-26" },
        {
          id: "ORD003",
          amount: 3200,
          status: "processing",
          date: "2025-07-25",
        },
      ],
    };

    res.status(200).json({
      success: true,
      data: orderAnalytics,
    });
  } catch (error) {
    console.error("Order analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order analytics",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Create smart inventory item
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      userType,
      name,
      category,
      currentStock,
      minThreshold,
      maxThreshold,
      unit,
      avgConsumption,
      reorderPoint,
      supplierName,
      lastPrice,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !name ||
      !category ||
      currentStock === undefined ||
      minThreshold === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User ID, name, category, current stock, and min threshold are required",
      });
    }

    const itemData = {
      userId,
      userType: userType || "vendor",
      name: name.trim(),
      category,
      currentStock: parseFloat(currentStock),
      minThreshold: parseFloat(minThreshold),
      maxThreshold: parseFloat(maxThreshold || currentStock * 2),
      unit: unit || "kg",
      avgConsumption: parseFloat(avgConsumption || 0),
      reorderPoint: parseFloat(reorderPoint || minThreshold),
      supplierName: supplierName?.trim() || "",
      lastPrice: parseFloat(lastPrice || 0),
      createdAt: new Date(),
      lastUpdated: new Date(),
      stockHistory: [
        {
          stock: parseFloat(currentStock),
          change: 0,
          reason: "Initial stock",
          timestamp: new Date(),
        },
      ],
      alertsGenerated: 0,
      lastAlert: null,
      predictedStockout: null,
    };

    // Calculate initial status
    itemData.status = calculateStockStatus(itemData);

    // Calculate predicted stockout date
    if (itemData.avgConsumption > 0) {
      const daysRemaining = itemData.currentStock / itemData.avgConsumption;
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + Math.floor(daysRemaining));
      itemData.predictedStockout = stockoutDate;
    }

    const docRef = await db.collection("smartInventory").add(itemData);

    // Generate alert if needed
    await checkAndCreateStockAlert(docRef.id, itemData);

    res.status(201).json({
      success: true,
      message: "Smart inventory item created successfully",
      id: docRef.id,
      data: { id: docRef.id, ...itemData },
    });
  } catch (error) {
    console.error("Create smart inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create inventory item",
      error: error.message,
    });
  }
});

// Get user's smart inventory
router.get("/", async (req, res) => {
  try {
    const { userId, category, status } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let query = db.collection("smartInventory").where("userId", "==", userId);

    if (category) {
      query = query.where("category", "==", category);
    }

    if (status) {
      query = query.where("status", "==", status);
    }

    query = query.orderBy("lastUpdated", "desc");

    const snapshot = await query.get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      lastUpdated:
        doc.data().lastUpdated?.toDate?.()?.toISOString() ||
        doc.data().lastUpdated,
      predictedStockout:
        doc.data().predictedStockout?.toDate?.()?.toISOString() ||
        doc.data().predictedStockout,
    }));

    res.json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error) {
    console.error("Get smart inventory error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update stock level
router.patch("/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStock, reason = "Manual update" } = req.body;

    if (currentStock === undefined || currentStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid current stock is required",
      });
    }

    const itemRef = db.collection("smartInventory").doc(id);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    const currentItem = itemDoc.data();
    const stockChange = parseFloat(currentStock) - currentItem.currentStock;

    // Update stock history
    const stockHistory = currentItem.stockHistory || [];
    stockHistory.push({
      stock: parseFloat(currentStock),
      change: stockChange,
      reason,
      timestamp: new Date(),
    });

    // Keep only last 50 entries
    if (stockHistory.length > 50) {
      stockHistory.splice(0, stockHistory.length - 50);
    }

    const updatedData = {
      currentStock: parseFloat(currentStock),
      stockHistory,
      lastUpdated: new Date(),
    };

    // Recalculate status
    const updatedItem = { ...currentItem, ...updatedData };
    updatedData.status = calculateStockStatus(updatedItem);

    // Recalculate predicted stockout
    if (updatedItem.avgConsumption > 0) {
      const daysRemaining =
        updatedItem.currentStock / updatedItem.avgConsumption;
      const stockoutDate = new Date();
      stockoutDate.setDate(stockoutDate.getDate() + Math.floor(daysRemaining));
      updatedData.predictedStockout = stockoutDate;
    }

    await itemRef.update(updatedData);

    // Check if new alert needed
    await checkAndCreateStockAlert(id, updatedItem);

    res.json({
      success: true,
      message: "Stock updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get stock alerts for user
router.get("/alerts", async (req, res) => {
  try {
    const { userId, priority } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let query = db
      .collection("stockAlerts")
      .where("userId", "==", userId)
      .where("resolved", "==", false);

    if (priority) {
      query = query.where("priority", "==", priority);
    }

    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();
    const alerts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    }));

    res.json({
      success: true,
      data: alerts,
      total: alerts.length,
    });
  } catch (error) {
    console.error("Get stock alerts error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Mark alert as resolved
router.patch("/alerts/:alertId/resolve", async (req, res) => {
  try {
    const { alertId } = req.params;

    await db.collection("stockAlerts").doc(alertId).update({
      resolved: true,
      resolvedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Alert marked as resolved",
    });
  } catch (error) {
    console.error("Resolve alert error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get reorder suggestions
router.get("/reorder-suggestions", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const snapshot = await db
      .collection("smartInventory")
      .where("userId", "==", userId)
      .get();

    const suggestions = [];

    for (const doc of snapshot.docs) {
      const item = { id: doc.id, ...doc.data() };
      const suggestion = generateReorderSuggestion(item);

      if (suggestion.shouldReorder) {
        suggestions.push({
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          currentStock: item.currentStock,
          minThreshold: item.minThreshold,
          maxThreshold: item.maxThreshold,
          unit: item.unit,
          supplierName: item.supplierName,
          lastPrice: item.lastPrice,
          ...suggestion,
        });
      }
    }

    // Sort by urgency (critical first)
    suggestions.sort((a, b) => {
      const urgencyOrder = { CRITICAL: 3, URGENT: 2, Normal: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    });

    res.json({
      success: true,
      data: suggestions,
      total: suggestions.length,
    });
  } catch (error) {
    console.error("Get reorder suggestions error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Helper function to calculate stock status
function calculateStockStatus(item) {
  const { currentStock, minThreshold, maxThreshold } = item;

  if (currentStock <= 0) return "Out of Stock";
  if (currentStock <= minThreshold * 0.5) return "Critical";
  if (currentStock <= minThreshold) return "Low Stock";
  if (currentStock >= maxThreshold) return "Overstocked";
  return "In Stock";
}

// Helper function to generate reorder suggestion
function generateReorderSuggestion(item) {
  const {
    currentStock,
    minThreshold,
    maxThreshold,
    avgConsumption,
    lastPrice,
  } = item;

  const status = calculateStockStatus(item);
  const daysRemaining =
    avgConsumption > 0 ? Math.floor(currentStock / avgConsumption) : null;

  if (status === "Out of Stock" || status === "Critical") {
    const suggestedQuantity = maxThreshold - currentStock;
    const urgency =
      status === "Out of Stock"
        ? "CRITICAL"
        : daysRemaining && daysRemaining < 3
        ? "URGENT"
        : "Normal";

    return {
      shouldReorder: true,
      urgency,
      suggestedQuantity,
      estimatedCost: suggestedQuantity * (lastPrice || 0),
      daysRemaining,
      reason:
        status === "Out of Stock"
          ? "Item is out of stock"
          : "Stock is critically low",
    };
  }

  if (status === "Low Stock") {
    const suggestedQuantity = maxThreshold - currentStock;
    const urgency = daysRemaining && daysRemaining < 7 ? "URGENT" : "Normal";

    return {
      shouldReorder: true,
      urgency,
      suggestedQuantity,
      estimatedCost: suggestedQuantity * (lastPrice || 0),
      daysRemaining,
      reason: "Stock is below minimum threshold",
    };
  }

  return { shouldReorder: false };
}

// Helper function to check and create stock alerts
async function checkAndCreateStockAlert(itemId, item) {
  try {
    const status = calculateStockStatus(item);
    const priority = getPriorityFromStatus(status);

    if (priority === "normal") return; // No alert needed

    // Check if similar alert already exists
    const existingAlertSnapshot = await db
      .collection("stockAlerts")
      .where("itemId", "==", itemId)
      .where("resolved", "==", false)
      .where("priority", "==", priority)
      .get();

    if (!existingAlertSnapshot.empty) return; // Alert already exists

    // Create new alert
    const alertData = {
      userId: item.userId,
      itemId,
      itemName: item.name,
      category: item.category,
      currentStock: item.currentStock,
      minThreshold: item.minThreshold,
      status,
      priority,
      message: generateAlertMessage(item, status),
      resolved: false,
      createdAt: new Date(),
    };

    await db.collection("stockAlerts").add(alertData);

    // Update item's alert count
    await db
      .collection("smartInventory")
      .doc(itemId)
      .update({
        alertsGenerated: (item.alertsGenerated || 0) + 1,
        lastAlert: new Date(),
      });
  } catch (error) {
    console.error("Error creating stock alert:", error);
  }
}

// Helper function to get priority from status
function getPriorityFromStatus(status) {
  switch (status) {
    case "Out of Stock":
      return "critical";
    case "Critical":
      return "high";
    case "Low Stock":
      return "medium";
    case "Overstocked":
      return "low";
    default:
      return "normal";
  }
}

// Helper function to generate alert message
function generateAlertMessage(item, status) {
  const daysRemaining =
    item.avgConsumption > 0
      ? Math.floor(item.currentStock / item.avgConsumption)
      : null;

  switch (status) {
    case "Out of Stock":
      return `${item.name} is completely out of stock. Immediate reorder required.`;
    case "Critical":
      return `${item.name} stock is critically low (${item.currentStock} ${
        item.unit
      }).${daysRemaining ? ` Only ${daysRemaining} days remaining.` : ""}`;
    case "Low Stock":
      return `${item.name} is below minimum threshold (${item.currentStock}/${
        item.minThreshold
      } ${item.unit}).${
        daysRemaining ? ` Approximately ${daysRemaining} days remaining.` : ""
      }`;
    case "Overstocked":
      return `${item.name} is overstocked (${item.currentStock}/${item.maxThreshold} ${item.unit}). Consider reducing orders.`;
    default:
      return `Stock alert for ${item.name}`;
  }
}

module.exports = router;

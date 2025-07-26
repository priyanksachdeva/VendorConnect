const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Create price alert
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      itemName,
      category,
      targetPrice,
      currentPrice,
      alertType,
      isActive = true,
    } = req.body;

    // Validate required fields
    if (!userId || !itemName || !targetPrice || !alertType) {
      return res.status(400).json({
        success: false,
        message:
          "User ID, item name, target price, and alert type are required",
      });
    }

    if (targetPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target price must be greater than 0",
      });
    }

    const alertData = {
      userId,
      itemName: itemName.trim(),
      category: category || "Other",
      targetPrice: parseFloat(targetPrice),
      currentPrice: parseFloat(currentPrice || 0),
      alertType, // "below" or "above"
      isActive,
      triggered: false,
      createdAt: new Date(),
      lastChecked: new Date(),
      triggerCount: 0,
    };

    const docRef = await db.collection("priceAlerts").add(alertData);

    res.status(201).json({
      success: true,
      message: "Price alert created successfully",
      id: docRef.id,
      data: { id: docRef.id, ...alertData },
    });
  } catch (error) {
    console.error("Create price alert error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create price alert",
      error: error.message,
    });
  }
});

// Get user's price alerts
router.get("/", async (req, res) => {
  try {
    const { userId, isActive } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let query = db.collection("priceAlerts").where("userId", "==", userId);

    if (isActive !== undefined) {
      query = query.where("isActive", "==", isActive === "true");
    }

    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();
    const alerts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      lastChecked:
        doc.data().lastChecked?.toDate?.()?.toISOString() ||
        doc.data().lastChecked,
    }));

    res.json({
      success: true,
      data: alerts,
      total: alerts.length,
    });
  } catch (error) {
    console.error("Get price alerts error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update price alert
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.triggerCount;

    updateData.lastUpdated = new Date();

    await db.collection("priceAlerts").doc(id).update(updateData);

    res.json({
      success: true,
      message: "Price alert updated successfully",
    });
  } catch (error) {
    console.error("Update price alert error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete price alert
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("priceAlerts").doc(id).delete();

    res.json({
      success: true,
      message: "Price alert deleted successfully",
    });
  } catch (error) {
    console.error("Delete price alert error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Check price alerts (called by background job or cron)
router.post("/check", async (req, res) => {
  try {
    const { userId } = req.body;

    let query = db.collection("priceAlerts").where("isActive", "==", true);

    if (userId) {
      query = query.where("userId", "==", userId);
    }

    const snapshot = await query.get();
    const alerts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const triggeredAlerts = [];

    for (const alert of alerts) {
      try {
        // Get current market price for the item
        const currentPrice = await getCurrentMarketPrice(
          alert.itemName,
          alert.category
        );

        if (currentPrice && currentPrice !== alert.currentPrice) {
          // Update current price
          await db.collection("priceAlerts").doc(alert.id).update({
            currentPrice,
            lastChecked: new Date(),
          });

          // Check if alert should be triggered
          const shouldTrigger = checkAlertCondition(alert, currentPrice);

          if (shouldTrigger && !alert.triggered) {
            // Trigger alert
            await db
              .collection("priceAlerts")
              .doc(alert.id)
              .update({
                triggered: true,
                triggerCount: (alert.triggerCount || 0) + 1,
                lastTriggered: new Date(),
              });

            triggeredAlerts.push({
              ...alert,
              currentPrice,
              triggered: true,
            });

            // Create notification record
            await createNotification({
              userId: alert.userId,
              type: "price_alert",
              title: "Price Alert Triggered!",
              message: `${alert.itemName} is now ₹${currentPrice} (Target: ₹${alert.targetPrice})`,
              data: {
                alertId: alert.id,
                itemName: alert.itemName,
                currentPrice,
                targetPrice: alert.targetPrice,
              },
            });
          }
        }
      } catch (itemError) {
        console.error(`Error checking alert ${alert.id}:`, itemError);
      }
    }

    res.json({
      success: true,
      message: `Checked ${alerts.length} alerts, ${triggeredAlerts.length} triggered`,
      data: triggeredAlerts,
    });
  } catch (error) {
    console.error("Check price alerts error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Helper function to get current market price
async function getCurrentMarketPrice(itemName, category) {
  try {
    // First, try to get price from marketplace
    const marketplaceSnapshot = await db
      .collection("inventory")
      .where("name", "==", itemName)
      .where("quantity", ">", 0)
      .orderBy("price", "asc")
      .limit(5)
      .get();

    if (!marketplaceSnapshot.empty) {
      const prices = marketplaceSnapshot.docs.map((doc) => doc.data().price);
      return prices.reduce((sum, price) => sum + price, 0) / prices.length; // Average price
    }

    // Fallback: Try to get from mandi data
    const mandiResponse = await fetch(
      `http://localhost:5000/api/mandi?commodity=${encodeURIComponent(
        itemName
      )}`
    );
    if (mandiResponse.ok) {
      const mandiData = await mandiResponse.json();
      if (mandiData.data && mandiData.data.length > 0) {
        const modalPrice = mandiData.data[0].modalPrice;
        return modalPrice ? parseFloat(modalPrice) : null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting current market price:", error);
    return null;
  }
}

// Helper function to check if alert condition is met
function checkAlertCondition(alert, currentPrice) {
  if (alert.alertType === "below") {
    return currentPrice <= alert.targetPrice;
  } else if (alert.alertType === "above") {
    return currentPrice >= alert.targetPrice;
  }
  return false;
}

// Helper function to create notification
async function createNotification(notificationData) {
  try {
    await db.collection("notifications").add({
      ...notificationData,
      read: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

// Reset triggered alerts (call this daily to reset alerts)
router.post("/reset-triggered", async (req, res) => {
  try {
    const snapshot = await db
      .collection("priceAlerts")
      .where("triggered", "==", true)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { triggered: false });
    });

    await batch.commit();

    res.json({
      success: true,
      message: `Reset ${snapshot.size} triggered alerts`,
    });
  } catch (error) {
    console.error("Reset triggered alerts error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Get all orders with filtering
router.get("/", async (req, res) => {
  try {
    const { vendorId, supplierId } = req.query;
    let query = db.collection("orders").orderBy("createdAt", "desc");

    if (vendorId) {
      query = query.where("vendorId", "==", vendorId);
    }

    if (supplierId) {
      // For suppliers, we need to check if any items in the order are from this supplier
      const snapshot = await db.collection("orders").get();
      const orders = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (order) =>
            order.items &&
            order.items.some((item) => item.supplierId === supplierId)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(orders);
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("orders").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post("/", async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      createdAt: req.body.createdAt || new Date().toISOString(),
      status: req.body.status || "pending",
      orderNumber: `ORD-${Date.now()}`,
    };

    // Start a Firestore transaction to ensure data consistency
    const result = await db.runTransaction(async (transaction) => {
      const orderRef = db.collection("orders").doc();

      // Check and update inventory quantities for each item
      for (const item of orderData.items) {
        if (item.itemId) {
          const inventoryRef = db.collection("inventory").doc(item.itemId);
          const inventoryDoc = await transaction.get(inventoryRef);

          if (inventoryDoc.exists) {
            const inventoryData = inventoryDoc.data();
            const currentQuantity = inventoryData.quantity || 0;
            const orderedQuantity = item.quantity || 0;

            if (currentQuantity >= orderedQuantity) {
              // Update inventory quantity
              const newQuantity = currentQuantity - orderedQuantity;
              const newStatus = calculateStatus(
                newQuantity,
                inventoryData.minQuantity || 0
              );

              transaction.update(inventoryRef, {
                quantity: newQuantity,
                status: newStatus,
                lastUpdated: new Date(),
              });

              console.log(
                `📦 Updated inventory: ${inventoryData.name} - ${currentQuantity} → ${newQuantity}`
              );
            } else {
              throw new Error(
                `Insufficient inventory for ${item.itemName}. Available: ${currentQuantity}, Requested: ${orderedQuantity}`
              );
            }
          }
        }
      }

      // Create the order
      transaction.set(orderRef, orderData);

      return { id: orderRef.id, ...orderData };
    });

    console.log("✅ Order created successfully:", {
      orderId: result.id,
      orderNumber: result.orderNumber,
      vendor: result.vendorName,
      itemCount: result.items.length,
      totalAmount: result.totalAmount,
    });

    res.json({
      message: "Order created successfully",
      id: result.id,
      order: result,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate inventory status
function calculateStatus(quantity, minQuantity) {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= minQuantity) return "Low Stock";
  if (quantity <= minQuantity * 2) return "Critical";
  return "In Stock";
}

// Update order status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      ...req.body,
      updatedAt: new Date(),
    };
    await db.collection("orders").doc(id).update(data);
    res.json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await db.collection("orders").doc(id).update(data);
    res.json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("orders").doc(id).delete();
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

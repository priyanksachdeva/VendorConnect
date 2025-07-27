const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Mock orders data for testing when Firebase is not available
const mockOrders = [
  {
    id: "order_1",
    orderNumber: "ORD-1753522000001",
    vendorId: "hsueTWnxUhUHKanHMSqsF1wuyF22", // Add your actual vendor ID here
    vendorName: "Test Vendor",
    supplierId: "supplier_1",
    supplierName: "Fresh Vegetables Hub",
    items: [
      {
        itemId: "item_1",
        itemName: "Fresh Tomatoes",
        quantity: 50,
        unitPrice: 40,
        total: 2000,
      },
    ],
    totalAmount: 2000,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order_2",
    orderNumber: "ORD-1753522000001",
    vendorId: "vendor_1",
    vendorName: "Test Vendor",
    supplierId: "supplier_1",
    supplierName: "Fresh Vegetables Hub",
    items: [
      {
        itemId: "item_1",
        itemName: "Fresh Tomatoes",
        quantity: 50,
        unitPrice: 40,
        total: 2000,
      },
    ],
    totalAmount: 2000,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order_2",
    orderNumber: "ORD-1753522000002",
    vendorId: "vendor_2",
    vendorName: "Another Vendor",
    supplierId: "supplier_2",
    supplierName: "Spice Masters",
    items: [
      {
        itemId: "item_2",
        itemName: "Turmeric Powder",
        quantity: 10,
        unitPrice: 250,
        total: 2500,
      },
    ],
    totalAmount: 2500,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Get all orders with filtering
router.get("/", async (req, res) => {
  try {
    const { vendorId, supplierId } = req.query;
    console.log("[Orders GET] Query params:", { vendorId, supplierId });

    // Try Firebase first, fallback to mock data
    try {
      let query = db.collection("orders");

      if (vendorId) {
        query = query.where("vendorId", "==", vendorId);
      }

      // Get all documents first, then sort in memory to avoid index requirements
      const snapshot = await query.get();
      let orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt in memory
      orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (supplierId) {
        // For suppliers, we need to check if any items in the order are from this supplier
        const supplierSnapshot = await db.collection("orders").get();
        const supplierOrders = supplierSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (order) =>
              order.items &&
              order.items.some((item) => item.supplierId === supplierId)
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return res.status(200).json({
          success: true,
          data: supplierOrders,
          total: supplierOrders.length,
        });
      }

      console.log("[Orders GET] Firebase orders found:", orders.length);
      res.status(200).json({
        success: true,
        data: orders,
        total: orders.length,
      });
    } catch (firebaseError) {
      console.log(
        "Firebase unavailable, using mock data:",
        firebaseError.message
      );

      // Use mock data
      let filteredOrders = [...mockOrders];

      if (vendorId) {
        filteredOrders = filteredOrders.filter(
          (order) => order.vendorId === vendorId
        );
      }

      if (supplierId) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.items &&
            order.items.some((item) => item.supplierId === supplierId)
        );
      }

      res.status(200).json({
        success: true,
        data: filteredOrders,
        total: filteredOrders.length,
        source: "mock_data",
      });
    }
  } catch (error) {
    console.error("Orders GET error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
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

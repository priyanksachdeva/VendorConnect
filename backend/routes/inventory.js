const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Get all inventory with optional filtering
router.get("/", async (req, res) => {
  try {
    const { status, category, supplier, supplierId, search } = req.query;
    let query = db.collection("inventory");

    // Apply filters
    if (status) {
      query = query.where("status", "==", status);
    }
    if (category) {
      query = query.where("category", "==", category);
    }
    if (supplier) {
      query = query.where("supplier", "==", supplier);
    }
    if (supplierId) {
      query = query.where("supplierId", "==", supplierId);
    }

    const snapshot = await query.get();
    let inventory = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Apply text search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      inventory = inventory.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get low stock items
router.get("/alerts/low-stock", async (req, res) => {
  try {
    const snapshot = await db.collection("inventory").get();
    const lowStockItems = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.quantity <= item.minQuantity);

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory statistics
router.get("/stats", async (req, res) => {
  try {
    const snapshot = await db.collection("inventory").get();
    const items = snapshot.docs.map((doc) => doc.data());

    const stats = {
      totalItems: items.length,
      totalValue: items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ),
      lowStockItems: items.filter((item) => item.quantity <= item.minQuantity)
        .length,
      outOfStockItems: items.filter((item) => item.quantity === 0).length,
      categories: [...new Set(items.map((item) => item.category))].length,
      statusBreakdown: {
        "In Stock": items.filter((item) => item.status === "In Stock").length,
        "Low Stock": items.filter((item) => item.status === "Low Stock").length,
        Critical: items.filter((item) => item.status === "Critical").length,
        "Out of Stock": items.filter((item) => item.status === "Out of Stock")
          .length,
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create inventory item
router.post("/", async (req, res) => {
  try {
    const data = {
      ...req.body,
      lastUpdated: new Date(),
      status: calculateStatus(req.body.quantity, req.body.minQuantity),
    };
    const docRef = await db.collection("inventory").add(data);
    res.json({ message: "Inventory item added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      ...req.body,
      lastUpdated: new Date(),
    };

    // Auto-update status based on quantity
    if (data.quantity !== undefined && data.minQuantity !== undefined) {
      data.status = calculateStatus(data.quantity, data.minQuantity);
    }

    await db.collection("inventory").doc(id).update(data);
    res.json({ message: "Inventory item updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete inventory item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("inventory").doc(id).delete();
    res.json({ message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate status based on quantity
function calculateStatus(quantity, minQuantity) {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= minQuantity * 0.5) return "Critical";
  if (quantity <= minQuantity) return "Low Stock";
  return "In Stock";
}

module.exports = router;

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
    const data = {
      ...req.body,
      createdAt: req.body.createdAt || new Date().toISOString(),
      status: req.body.status || "pending",
    };
    const docRef = await db.collection("orders").add(data);
    res.json({ message: "Order created", id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

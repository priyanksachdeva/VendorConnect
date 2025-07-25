const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Get all suppliers with optional filtering
router.get("/", async (req, res) => {
  try {
    const { category, location, verified, search } = req.query;
    let query = db.collection("suppliers");

    // Apply filters
    if (category) {
      query = query.where("category", "==", category);
    }
    if (verified !== undefined) {
      query = query.where("verified", "==", verified === "true");
    }
    if (location) {
      query = query
        .where("location", ">=", location)
        .where("location", "<=", location + "\uf8ff");
    }

    const snapshot = await query.get();
    let suppliers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Apply text search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      suppliers = suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchLower) ||
          supplier.products.some((product) =>
            product.toLowerCase().includes(searchLower)
          )
      );
    }

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supplier by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("suppliers").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new supplier
router.post("/", async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdAt: new Date(),
      verified: req.body.verified || false,
      rating: req.body.rating || 0,
    };
    const docRef = await db.collection("suppliers").add(data);
    res.json({ message: "Supplier added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update supplier
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      ...req.body,
      updatedAt: new Date(),
    };
    await db.collection("suppliers").doc(id).update(data);
    res.json({ message: "Supplier updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete supplier
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("suppliers").doc(id).delete();
    res.json({ message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supplier categories
router.get("/meta/categories", async (req, res) => {
  try {
    const snapshot = await db.collection("suppliers").get();
    const categories = [
      ...new Set(snapshot.docs.map((doc) => doc.data().category)),
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

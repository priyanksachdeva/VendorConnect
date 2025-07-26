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

// Add new inventory item - MUST be before /:id route
router.post("/inventory", async (req, res) => {
  try {
    const { name, category, quantity, price, unit, supplierId } = req.body;

    // Input validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be a non-empty string",
      });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category is required and must be a string",
      });
    }

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required and must be a positive number",
      });
    }

    if (!price || typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price is required and must be a positive number",
      });
    }

    if (!unit || typeof unit !== "string") {
      return res.status(400).json({
        success: false,
        message: "Unit is required and must be a string",
      });
    }

    if (!supplierId || typeof supplierId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Supplier ID is required and must be a string",
      });
    }

    // Create new inventory item
    const newItem = {
      id: `inv_${Date.now()}`,
      name: name.trim(),
      category,
      quantity,
      price,
      unit,
      supplierId,
      status: quantity > 10 ? "Available" : "Low Stock",
      lastUpdated: new Date().toISOString(),
    };

    // In real app, save to database
    // For testing, just return success
    res.status(201).json({
      success: true,
      message: "Inventory item added successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Add inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add inventory item",
      error: error.message,
    });
  }
});

// Get supplier inventory - MUST be before /:id route
router.get("/inventory", async (req, res) => {
  try {
    const { supplierId, category, status } = req.query;

    // Mock supplier inventory data for testing
    const mockInventory = [
      {
        id: "inv_1",
        supplierId: "supplier_1",
        name: "Fresh Tomatoes",
        category: "Vegetables",
        quantity: 500,
        price: 40,
        unit: "kg",
        status: "Available",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "inv_2",
        supplierId: "supplier_2",
        name: "Turmeric Powder",
        category: "Spices",
        quantity: 100,
        price: 250,
        unit: "kg",
        status: "Available",
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "inv_3",
        supplierId: "supplier_1",
        name: "Fresh Onions",
        category: "Vegetables",
        quantity: 800,
        price: 30,
        unit: "kg",
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
      },
    ];

    let filteredInventory = [...mockInventory];

    // Filter by supplier ID
    if (supplierId) {
      filteredInventory = filteredInventory.filter(
        (item) => item.supplierId === supplierId
      );
    }

    // Filter by category
    if (category) {
      filteredInventory = filteredInventory.filter(
        (item) => item.category === category
      );
    }

    // Filter by status
    if (status) {
      filteredInventory = filteredInventory.filter(
        (item) => item.status === status
      );
    }

    res.status(200).json({
      success: true,
      data: filteredInventory,
      total: filteredInventory.length,
    });
  } catch (error) {
    console.error("Supplier inventory error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
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

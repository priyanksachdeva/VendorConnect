const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Get all inventory with optional filtering
router.get("/", async (req, res) => {
  try {
    const { status, category, supplier, supplierId, search, availableOnly } =
      req.query;

    // Simple query to avoid index requirements
    let query = db.collection("inventory");

    // Use only one filter to avoid compound index requirements
    if (supplierId) {
      query = query.where("supplierId", "==", supplierId);
    } else if (status) {
      query = query.where("status", "==", status);
    } else if (category) {
      query = query.where("category", "==", category);
    } else if (supplier) {
      query = query.where("supplier", "==", supplier);
    }

    const snapshot = await query.get();
    let inventory = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Ensure consistent price field for marketplace
      price: doc.data().price || doc.data().unitPrice || 0,
      unitPrice: doc.data().price || doc.data().unitPrice || 0,
    }));

    // Apply remaining filters in memory
    if (status && !supplierId && query._filters.length === 0) {
      inventory = inventory.filter((item) => item.status === status);
    }
    if (category && !supplierId && !status) {
      inventory = inventory.filter((item) => item.category === category);
    }
    if (supplier && !supplierId && !status && !category) {
      inventory = inventory.filter((item) => item.supplier === supplier);
    }

    // Apply text search if provided
    if (search) {
      const searchLower = search.toLowerCase();
      inventory = inventory.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.sku?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter for available items only (for marketplace)
    if (availableOnly === "true") {
      inventory = inventory.filter(
        (item) => item.quantity > 0 && item.status !== "Out of Stock"
      );
    }

    // Sort by last updated (in memory)
    inventory.sort((a, b) => {
      const aDate = a.lastUpdated || a.createdAt || new Date(0);
      const bDate = b.lastUpdated || b.createdAt || new Date(0);
      return new Date(bDate) - new Date(aDate);
    });

    console.log(`📦 Fetched ${inventory.length} inventory items`, {
      filters: {
        status,
        category,
        supplier,
        supplierId,
        search,
        availableOnly,
      },
      totalItems: inventory.length,
    });

    res.json(inventory);
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get marketplace items (available items for vendors to order)
router.get("/marketplace", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;

    // Simple query without any ordering to avoid index requirements
    const snapshot = await db.collection("inventory").get();

    let marketplaceItems = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure consistent field names for marketplace
        price: data.price || data.unitPrice || 0,
        unitPrice: data.price || data.unitPrice || 0,
        availableQuantity: data.quantity,
        minOrder: data.minOrder || 1,
        supplierName: data.supplierName || data.supplier || "Unknown Supplier",
        unit: data.unit || "piece",
        category: data.category || "Other",
        status: data.quantity > 0 ? "Available" : "Out of Stock",
      };
    });

    // Filter in memory to avoid complex Firestore queries
    marketplaceItems = marketplaceItems.filter(
      (item) => item.quantity > 0 && item.status !== "Out of Stock"
    );

    // Apply category filter
    if (category && category !== "all") {
      marketplaceItems = marketplaceItems.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      marketplaceItems = marketplaceItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.supplierName.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filters
    if (minPrice) {
      marketplaceItems = marketplaceItems.filter(
        (item) => item.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      marketplaceItems = marketplaceItems.filter(
        (item) => item.price <= parseFloat(maxPrice)
      );
    }

    // Sort by newest first (in memory)
    marketplaceItems.sort((a, b) => {
      const aDate = a.lastUpdated || a.createdAt || new Date(0);
      const bDate = b.lastUpdated || b.createdAt || new Date(0);
      return new Date(bDate) - new Date(aDate);
    });

    console.log(
      `🛒 Marketplace: Found ${marketplaceItems.length} available items for vendors`
    );

    res.json(marketplaceItems);
  } catch (error) {
    console.error("❌ Error fetching marketplace items:", error);
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
      createdAt: new Date(),
      status: calculateStatus(
        req.body.quantity || 0,
        req.body.minQuantity || 0
      ),
      // Ensure proper data structure for marketplace
      price: parseFloat(req.body.price || req.body.unitPrice || 0),
      unitPrice: parseFloat(req.body.price || req.body.unitPrice || 0),
      minOrder: parseInt(req.body.minOrder || 1),
      quantity: parseInt(req.body.quantity || 0),
      minQuantity: parseInt(req.body.minQuantity || 0),
      maxQuantity: parseInt(
        req.body.maxQuantity || req.body.quantity * 10 || 100
      ),
    };

    // Generate SKU if not provided
    if (!data.sku) {
      const categoryPrefix = data.category
        ? data.category.substring(0, 3).toUpperCase()
        : "ITM";
      const namePrefix = data.name
        ? data.name.substring(0, 3).toUpperCase()
        : "XXX";
      const timestamp = Date.now().toString().slice(-6);
      data.sku = `${categoryPrefix}-${namePrefix}-${timestamp}`;
    }

    const docRef = await db.collection("inventory").add(data);

    // Get the created item with its ID
    const createdItem = { id: docRef.id, ...data };

    console.log("✅ New inventory item created:", {
      id: docRef.id,
      name: data.name,
      supplier: data.supplierName,
      quantity: data.quantity,
      price: data.price,
    });

    res.json({
      message: "Inventory item added successfully",
      id: docRef.id,
      item: createdItem,
    });
  } catch (error) {
    console.error("❌ Error creating inventory item:", error);
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

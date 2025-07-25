const db = require("../config/firebase");

const getAllInventory = async (req, res) => {
  try {
    const snapshot = await db.collection("inventory").get();
    const inventory = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("inventory").add(data);
    res.json({ message: "Inventory item added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await db.collection("inventory").doc(id).update(data);
    res.json({ message: "Inventory item updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("inventory").doc(id).delete();
    res.json({ message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};

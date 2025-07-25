const db = require("../config/firebase");

const getAllSuppliers = async (req, res) => {
  try {
    const snapshot = await db.collection("suppliers").get();
    const suppliers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("suppliers").add(data);
    res.json({ message: "Supplier added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  createSupplier,
};

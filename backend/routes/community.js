const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("community").get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("community").add(data);
    res.json({ message: "Community post added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

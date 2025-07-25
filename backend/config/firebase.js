const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Check if service account key exists
if (!fs.existsSync(serviceAccountPath)) {
  console.warn("⚠️  Firebase service account key not found!");
  console.warn(
    "📝 Please add your serviceAccountKey.json file to backend/config/"
  );
  console.warn("🔗 Instructions: https://firebase.google.com/docs/admin/setup");

  // Export a mock db object for development
  module.exports = {
    collection: () => ({
      get: async () => ({ docs: [] }),
      add: async () => ({ id: "mock-id" }),
      doc: () => ({
        update: async () => {},
        delete: async () => {},
      }),
    }),
  };
} else {
  const serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  module.exports = db;
}

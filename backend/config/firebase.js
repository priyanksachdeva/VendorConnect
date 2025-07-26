const admin = require("firebase-admin");
require("dotenv").config();

// Load Firebase credentials from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Check if Firebase credentials are loaded
if (!serviceAccount.project_id || !serviceAccount.private_key) {
  console.warn("⚠️  Firebase environment variables not found!");
  console.warn("📝 Please check your .env file in the backend directory");
  console.warn("🔗 Make sure all FIREBASE_* variables are set");

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
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  module.exports = db;
}

import { auth } from "../config/firebase";

// Function to test Firebase configuration
export const testFirebaseConfig = () => {
  console.log("Testing Firebase configuration...");

  // Check if auth is properly initialized
  if (!auth) {
    console.error("Firebase auth is not initialized");
    return false;
  }

  console.log("Firebase Auth instance:", auth);
  console.log("Firebase App:", auth.app);
  console.log("Current user:", auth.currentUser);

  // Check environment variables
  const requiredEnvVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  console.log("Environment variables check:");
  requiredEnvVars.forEach((envVar) => {
    const value = import.meta.env[envVar];
    console.log(`${envVar}: ${value ? "✓ Set" : "✗ Missing"}`);
    if (!value) {
      console.error(`Missing environment variable: ${envVar}`);
    }
  });

  return true;
};

// Call this function to debug
console.log("=== Firebase Debug Info ===");
testFirebaseConfig();

const fs = require("fs");
const path = require("path");

function validateFirebaseSetup() {
  console.log("🔍 Validating Firebase setup...\n");

  const serviceAccountPath = path.join(
    __dirname,
    "../config/serviceAccountKey.json"
  );

  // Check if service account key exists
  if (!fs.existsSync(serviceAccountPath)) {
    console.log("❌ Firebase service account key not found!");
    console.log("📝 Please follow these steps:");
    console.log(
      "   1. Go to Firebase Console: https://console.firebase.google.com"
    );
    console.log("   2. Select your project");
    console.log("   3. Go to Project Settings > Service Accounts");
    console.log('   4. Click "Generate new private key"');
    console.log(
      "   5. Save the file as: backend/config/serviceAccountKey.json"
    );
    console.log("");
    return false;
  }

  try {
    // Validate service account key format
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    const requiredFields = [
      "type",
      "project_id",
      "private_key_id",
      "private_key",
      "client_email",
      "client_id",
      "auth_uri",
      "token_uri",
    ];

    const missingFields = requiredFields.filter(
      (field) => !serviceAccount[field]
    );

    if (missingFields.length > 0) {
      console.log("❌ Invalid service account key format!");
      console.log(`📝 Missing fields: ${missingFields.join(", ")}`);
      return false;
    }

    console.log("✅ Service account key found and valid");
    console.log(`📋 Project ID: ${serviceAccount.project_id}`);
    console.log(`📧 Service Account: ${serviceAccount.client_email}`);
    console.log("");

    // Test Firebase connection
    const admin = require("firebase-admin");

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    const db = admin.firestore();

    console.log("🔗 Testing Firestore connection...");

    // Test connection by reading from a collection
    return db
      .collection("suppliers")
      .limit(1)
      .get()
      .then((snapshot) => {
        console.log("✅ Firestore connection successful!");
        console.log(`📊 Current collections accessible`);
        return true;
      })
      .catch((error) => {
        console.log("❌ Firestore connection failed:");
        console.log(`   Error: ${error.message}`);
        console.log("");
        console.log("💡 Possible solutions:");
        console.log("   1. Verify your Firebase project has Firestore enabled");
        console.log(
          "   2. Check that your service account has proper permissions"
        );
        console.log(
          "   3. Ensure your project ID matches in the service account key"
        );
        return false;
      });
  } catch (error) {
    console.log("❌ Error reading service account key:");
    console.log(`   ${error.message}`);
    return false;
  }
}

// Run validation if called directly
if (require.main === module) {
  validateFirebaseSetup()
    .then((success) => {
      if (success) {
        console.log("🎉 Firebase setup is complete and working!");
        console.log("");
        console.log("🚀 Next steps:");
        console.log("   1. Run: npm run init-db (to add sample data)");
        console.log("   2. Run: npm start (to start the server)");
      } else {
        console.log("");
        console.log(
          "📚 For detailed setup instructions, see: FIREBASE_SETUP.md"
        );
      }
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("💥 Validation failed:", error);
      process.exit(1);
    });
}

module.exports = validateFirebaseSetup;

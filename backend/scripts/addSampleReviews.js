const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const sampleReviews = [
  {
    supplierId: "supplier_1",
    rating: 5,
    title: "Excellent quality vegetables!",
    comment:
      "Fresh Vegetables Hub consistently delivers high-quality produce. Their tomatoes are always fresh and well-packaged. Delivery is prompt and their customer service is excellent. Highly recommend for any restaurant or vendor.",
    reviewerId: "test_vendor_1",
    reviewerName: "Restaurant Express",
    orderId: "ORD-2025-001",
    verified: true,
    helpful: 5,
    flagged: false,
    createdAt: new Date("2025-01-20"),
  },
  {
    supplierId: "supplier_1",
    rating: 4,
    title: "Good supplier, minor delivery delays",
    comment:
      "Quality is good but sometimes delivery is a bit delayed. Overall satisfied with the products and pricing. Will continue to order from them.",
    reviewerId: "test_vendor_2",
    reviewerName: "Quick Mart",
    orderId: "ORD-2025-002",
    verified: true,
    helpful: 3,
    flagged: false,
    createdAt: new Date("2025-01-18"),
  },
  {
    supplierId: "supplier_2",
    rating: 5,
    title: "Best spice supplier in Delhi!",
    comment:
      "Spice King Wholesale has the best quality spices at competitive prices. Their turmeric and chili powder are authentic and fresh. Packaging is excellent and prevents contamination.",
    reviewerId: "test_vendor_3",
    reviewerName: "Spice Corner",
    orderId: null,
    verified: false,
    helpful: 8,
    flagged: false,
    createdAt: new Date("2025-01-15"),
  },
  {
    supplierId: "supplier_3",
    rating: 5,
    title: "Outstanding grain quality",
    comment:
      "Grain Masters provides premium quality rice and wheat. Their processing is excellent and storage conditions are perfect. Never had any quality issues with their products.",
    reviewerId: "test_vendor_4",
    reviewerName: "Wholesale Grains Ltd",
    orderId: "ORD-2025-003",
    verified: true,
    helpful: 6,
    flagged: false,
    createdAt: new Date("2025-01-12"),
  },
  {
    supplierId: "supplier_1",
    rating: 3,
    title: "Average experience",
    comment:
      "Products are okay but not exceptional. Had some quality issues with leafy greens last month. Customer service was responsive and resolved the issue, but could be better.",
    reviewerId: "test_vendor_5",
    reviewerName: "Green Market",
    orderId: null,
    verified: false,
    helpful: 2,
    flagged: false,
    createdAt: new Date("2025-01-10"),
  },
];

async function addSampleReviews() {
  console.log("🌟 Adding sample reviews to test the system...");

  try {
    for (const review of sampleReviews) {
      const docRef = await db.collection("reviews").add(review);
      console.log(
        `✅ Added review: "${review.title}" for supplier ${review.supplierId}`
      );
    }

    console.log("🎉 Sample reviews added successfully!");
    console.log(`📊 Total reviews added: ${sampleReviews.length}`);
    console.log("✨ You can now test the review system in the frontend!");
  } catch (error) {
    console.error("❌ Error adding sample reviews:", error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addSampleReviews().then(() => {
    console.log("Script completed!");
    process.exit(0);
  });
}

module.exports = { addSampleReviews };

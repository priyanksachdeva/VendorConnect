const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const sampleCommunityPosts = [
  {
    title: "Best suppliers for organic vegetables?",
    content:
      "Looking for reliable organic vegetable suppliers in Delhi NCR. Any recommendations? Need suppliers who can deliver fresh produce consistently for my restaurant chain.",
    category: "suppliers",
    authorId: "vendor_1",
    authorName: "Ravi Kumar",
    authorType: "vendor",
    upvotes: 12,
    replies: 8,
    upvotedBy: ["user1", "user2", "user3"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    title: "Wholesale rice prices dropping!",
    content:
      "Great news! Rice prices have dropped by 10% this week. Good time to stock up. I've been tracking prices across multiple mandis and this seems like a good opportunity for bulk purchases.",
    category: "market",
    authorId: "vendor_2",
    authorName: "Priya Sharma",
    authorType: "vendor",
    upvotes: 25,
    replies: 15,
    upvotedBy: ["user1", "user4", "user5", "user6"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    lastActivity: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    title: "New spice supplier in Khari Baoli",
    content:
      "Found an excellent new supplier for premium spices. Great quality and competitive prices! They specialize in organic spices and have excellent packaging. Can share contact details if anyone is interested.",
    category: "suppliers",
    authorId: "vendor_3",
    authorName: "Amit Singh",
    authorType: "vendor",
    upvotes: 18,
    replies: 12,
    upvotedBy: ["user2", "user3", "user7"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    title: "Tips for inventory management during monsoon",
    content:
      "Monsoon season is approaching and I'm looking for advice on how to manage inventory during this period. Especially concerned about storage of grains and preventing spoilage.",
    category: "tips",
    authorId: "vendor_4",
    authorName: "Manjeet Kaur",
    authorType: "vendor",
    upvotes: 8,
    replies: 6,
    upvotedBy: ["user1", "user8"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    title: "Alert: Steel packaging prices increasing",
    content:
      "Just got notice from my packaging supplier that steel container prices will increase by 15% next month due to raw material costs. Might want to stock up if you use metal containers.",
    category: "alerts",
    authorId: "supplier_1",
    authorName: "Industrial Packaging Co.",
    authorType: "supplier",
    upvotes: 22,
    replies: 9,
    upvotedBy: ["user3", "user4", "user9", "user10"],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    lastActivity: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
  },
  {
    title: "How to negotiate better payment terms?",
    content:
      "I'm a small vendor and struggling to negotiate better payment terms with suppliers. Most want immediate payment but my cash flow requires at least 15-30 days. Any advice on how to approach this?",
    category: "tips",
    authorId: "vendor_5",
    authorName: "Small Business Owner",
    authorType: "vendor",
    upvotes: 14,
    replies: 11,
    upvotedBy: ["user5", "user6", "user11"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
];

async function addSampleCommunityPosts() {
  console.log("💬 Adding sample community posts...");

  try {
    for (const post of sampleCommunityPosts) {
      const docRef = await db.collection("community").add(post);
      console.log(`✅ Added community post: "${post.title}"`);
    }

    console.log("🎉 Sample community posts added successfully!");
    console.log(`📊 Total posts added: ${sampleCommunityPosts.length}`);
    console.log("✨ Community is now ready for testing!");
  } catch (error) {
    console.error("❌ Error adding community posts:", error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addSampleCommunityPosts().then(() => {
    console.log("Script completed!");
    process.exit(0);
  });
}

module.exports = { addSampleCommunityPosts };

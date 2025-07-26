const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Mock community discussions data
const mockDiscussions = [
  {
    id: "disc_1",
    title: "Best practices for organic farming",
    content: "Looking for advice on transitioning to organic farming methods.",
    author: "FarmersUnited",
    authorId: "user_1",
    category: "Farming Tips",
    replies: 12,
    likes: 8,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    lastActivity: new Date().toISOString(),
  },
  {
    id: "disc_2",
    title: "Market prices for wheat in Punjab",
    content:
      "Current wheat prices seem to be fluctuating. Anyone have insights?",
    author: "WheatGrower",
    authorId: "user_2",
    category: "Market Discussion",
    replies: 5,
    likes: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    lastActivity: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "disc_3",
    title: "New government subsidies for farmers",
    content:
      "Discussion about the latest agricultural subsidies announced by the government.",
    author: "PolicyWatcher",
    authorId: "user_3",
    category: "Government Policies",
    replies: 18,
    likes: 15,
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    lastActivity: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  },
];

router.get("/", async (req, res) => {
  try {
    const { category, limit = 50, sortBy = "createdAt" } = req.query;

    let query = db.collection("community");

    // Filter by category if provided
    if (category && category !== "all") {
      query = query.where("category", "==", category);
    }

    // Sort by specified field (default to createdAt to avoid index issues)
    query = query.orderBy(sortBy, "desc");

    // Limit results
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      lastActivity:
        doc.data().lastActivity?.toDate?.()?.toISOString() ||
        doc.data().lastActivity,
    }));

    res.json({
      success: true,
      data: posts,
      total: posts.length,
    });
  } catch (error) {
    console.error("Get community posts error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/community/discussions - Get community discussions
router.get("/discussions", async (req, res) => {
  try {
    const { category, search, sortBy = "lastActivity", limit = 20 } = req.query;

    let filteredDiscussions = [...mockDiscussions];

    // Filter by category
    if (category && category !== "all") {
      filteredDiscussions = filteredDiscussions.filter(
        (disc) => disc.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredDiscussions = filteredDiscussions.filter(
        (disc) =>
          disc.title.toLowerCase().includes(searchTerm) ||
          disc.content.toLowerCase().includes(searchTerm) ||
          disc.author.toLowerCase().includes(searchTerm)
      );
    }

    // Sort discussions
    if (sortBy === "lastActivity") {
      filteredDiscussions.sort(
        (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
      );
    } else if (sortBy === "likes") {
      filteredDiscussions.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "replies") {
      filteredDiscussions.sort((a, b) => b.replies - a.replies);
    } else if (sortBy === "createdAt") {
      filteredDiscussions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // Apply limit
    const limitNum = parseInt(limit);
    if (limitNum && limitNum > 0) {
      filteredDiscussions = filteredDiscussions.slice(0, limitNum);
    }

    // Return as array directly (not wrapped in data object)
    res.status(200).json(filteredDiscussions);
  } catch (error) {
    console.error("Community discussions error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/community/discussions - Create a new discussion
router.post("/discussions", async (req, res) => {
  try {
    const { title, content, category, author, authorId } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // If no author provided, use a default or extract from auth header
    const finalAuthor = author || "Anonymous User";
    const finalAuthorId = authorId || `user_${Date.now()}`;

    // Create new discussion
    const newDiscussion = {
      id: `disc_${Date.now()}`,
      title,
      content,
      author: finalAuthor,
      authorId: finalAuthorId,
      category: category || "General",
      replies: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    // Add to mock data (in real app, save to database)
    mockDiscussions.push(newDiscussion);

    res.status(201).json({
      id: newDiscussion.id,
      ...newDiscussion,
    });
  } catch (error) {
    console.error("Create discussion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create discussion",
      error: error.message,
    });
  }
});

// DELETE /api/community/discussions/:id - Delete a discussion
router.delete("/discussions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the discussion in mock data
    const discussionIndex = mockDiscussions.findIndex((disc) => disc.id === id);

    if (discussionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Remove from mock data (in real app, delete from database)
    mockDiscussions.splice(discussionIndex, 1);

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    });
  } catch (error) {
    console.error("Delete discussion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete discussion",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      authorId,
      authorName,
      authorType,
      createdAt,
    } = req.body;

    // Validate required fields
    if (!title || !content || !authorId) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and author ID are required",
      });
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      category: category || "general",
      authorId,
      authorName: authorName || "Anonymous",
      authorType: authorType || "vendor",
      upvotes: 0,
      replies: 0,
      upvotedBy: [],
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      lastActivity: new Date(),
    };

    const docRef = await db.collection("community").add(postData);

    res.status(201).json({
      success: true,
      message: "Community post created successfully",
      id: docRef.id,
      data: { id: docRef.id, ...postData },
    });
  } catch (error) {
    console.error("Create community post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
});

// POST /api/community/:id/upvote - Upvote a post
router.post("/:id/upvote", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const postRef = db.collection("community").doc(id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const postData = postDoc.data();
    const upvotedBy = postData.upvotedBy || [];

    if (upvotedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User has already upvoted this post",
      });
    }

    await postRef.update({
      upvotes: (postData.upvotes || 0) + 1,
      upvotedBy: [...upvotedBy, userId],
      lastActivity: new Date(),
    });

    res.json({
      success: true,
      message: "Post upvoted successfully",
    });
  } catch (error) {
    console.error("Upvote post error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/community/:id/replies - Add reply to a post
router.post("/:id/replies", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, authorId, authorName, authorType, createdAt } = req.body;

    if (!content || !authorId) {
      return res.status(400).json({
        success: false,
        message: "Content and author ID are required",
      });
    }

    const replyData = {
      content: content.trim(),
      authorId,
      authorName: authorName || "Anonymous",
      authorType: authorType || "vendor",
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    };

    // Add reply to replies subcollection
    const replyRef = await db
      .collection("community")
      .doc(id)
      .collection("replies")
      .add(replyData);

    // Update post's reply count and last activity
    const postRef = db.collection("community").doc(id);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      await postRef.update({
        replies: (postDoc.data().replies || 0) + 1,
        lastActivity: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      id: replyRef.id,
      data: { id: replyRef.id, ...replyData },
    });
  } catch (error) {
    console.error("Add reply error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add reply",
      error: error.message,
    });
  }
});

module.exports = router;

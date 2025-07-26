const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Add supplier review
router.post("/:id/reviews", async (req, res) => {
  try {
    const { id: supplierId } = req.params;
    const { rating, title, comment, reviewerId, reviewerName, orderId } =
      req.body;

    // Validate required fields
    if (!rating || !title || !comment || !reviewerId) {
      return res.status(400).json({
        success: false,
        message: "Rating, title, comment, and reviewer ID are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Create review
    const reviewData = {
      supplierId,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      reviewerId,
      reviewerName: reviewerName || "Anonymous",
      orderId: orderId || null,
      createdAt: new Date(),
      helpful: 0,
      flagged: false,
      verified: !!orderId, // Verified if order ID provided
    };

    const docRef = await db.collection("reviews").add(reviewData);

    // Update supplier's average rating
    await updateSupplierRating(supplierId);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      id: docRef.id,
      data: { id: docRef.id, ...reviewData },
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
      error: error.message,
    });
  }
});

// Get supplier reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const { id: supplierId } = req.params;
    const { limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    let query = db.collection("reviews").where("supplierId", "==", supplierId);

    // Sort reviews
    query = query.orderBy(sortBy, order);

    // Limit results
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const snapshot = await query.get();
    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    }));

    // Calculate review stats
    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1)
          : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    res.json({
      success: true,
      data: reviews,
      stats,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update supplier's average rating
async function updateSupplierRating(supplierId) {
  try {
    const reviewsSnapshot = await db
      .collection("reviews")
      .where("supplierId", "==", supplierId)
      .get();

    if (reviewsSnapshot.empty) {
      await db.collection("suppliers").doc(supplierId).update({
        rating: 0,
        totalReviews: 0,
      });
      return;
    }

    const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await db
      .collection("suppliers")
      .doc(supplierId)
      .update({
        rating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews.length,
        lastReviewDate: new Date(),
      });
  } catch (error) {
    console.error("Error updating supplier rating:", error);
  }
}

// Mark review as helpful
router.post("/:supplierId/reviews/:reviewId/helpful", async (req, res) => {
  try {
    const { reviewId } = req.params;

    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const currentHelpful = reviewDoc.data().helpful || 0;
    await reviewRef.update({
      helpful: currentHelpful + 1,
    });

    res.json({
      success: true,
      message: "Review marked as helpful",
    });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Flag inappropriate review
router.post("/:supplierId/reviews/:reviewId/flag", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const reviewRef = db.collection("reviews").doc(reviewId);
    await reviewRef.update({
      flagged: true,
      flagReason: reason || "Inappropriate content",
      flaggedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Review flagged for moderation",
    });
  } catch (error) {
    console.error("Flag review error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

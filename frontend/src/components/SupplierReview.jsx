import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card, Input } from "./ui";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function SupplierReview({ supplierId, supplierName, onReviewAdded }) {
  const { user, userProfile } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const [review, setReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    orderId: "",
  });

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [supplierId]);

  const fetchReviews = async () => {
    try {
      setFetchingReviews(true);
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${supplierId}/reviews?limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
        setReviewStats(data.stats || null);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setFetchingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        ...review,
        supplierId,
        reviewerId: user.uid,
        reviewerName: userProfile?.businessName || user.displayName,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${supplierId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (response.ok) {
        toast.success("Review submitted successfully! ⭐");
        setReview({ rating: 5, title: "", comment: "", orderId: "" });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews list
        if (onReviewAdded) onReviewAdded();
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${supplierId}/reviews/${reviewId}/helpful`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.uid }),
        }
      );

      if (response.ok) {
        toast.success("Thank you for your feedback!");
        fetchReviews(); // Refresh to show updated helpful count
      } else {
        toast.error("Failed to record vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to record vote");
    }
  };

  const handleFlagReview = async (reviewId) => {
    if (!user) {
      toast.error("Please login to flag reviews");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${supplierId}/reviews/${reviewId}/flag`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.uid, reason: "inappropriate" }),
        }
      );

      if (response.ok) {
        toast.success("Review flagged for moderation");
        fetchReviews(); // Refresh reviews
      } else {
        toast.error("Failed to flag review");
      }
    } catch (error) {
      console.error("Error flagging review:", error);
      toast.error("Failed to flag review");
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${!readonly ? "hover:text-yellow-500 cursor-pointer" : ""}`}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with supplier info and review button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Reviews for {supplierName}
          </h3>
          {reviewStats && (
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <StarRating
                  rating={parseFloat(reviewStats.averageRating)}
                  readonly
                />
                <span className="text-lg font-semibold text-gray-700">
                  {reviewStats.averageRating}
                </span>
                <span className="text-gray-500">
                  ({reviewStats.totalReviews} reviews)
                </span>
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowReviewForm(true)}
          variant="primary"
          size="sm"
          className="bg-primary-600 hover:bg-primary-700"
        >
          ⭐ Write Review
        </Button>
      </div>

      {/* Reviews List */}
      {fetchingReviews ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading reviews...</div>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="text-center py-8">
          <div className="text-gray-500">
            No reviews yet. Be the first to review this supplier!
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((reviewItem) => (
            <Card key={reviewItem.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <StarRating rating={reviewItem.rating} readonly />
                    <span className="font-semibold text-gray-900">
                      {reviewItem.title}
                    </span>
                    {reviewItem.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{reviewItem.comment}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By: {reviewItem.reviewerName}</span>
                    <span>
                      {new Date(reviewItem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleHelpfulVote(reviewItem.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <span>👍</span>
                  <span>Helpful ({reviewItem.helpful || 0})</span>
                </button>
                <button
                  onClick={() => handleFlagReview(reviewItem.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <span>🚩</span>
                  <span>Report</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Form Modal */}

      {showReviewForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-strong"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <Card padding="none">
              <Card.Header>
                <div className="flex justify-between items-center">
                  <Card.Title>⭐ Rate & Review Supplier</Card.Title>
                  <Button
                    onClick={() => setShowReviewForm(false)}
                    variant="ghost"
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>
              </Card.Header>

              <Card.Content>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Rating
                    </label>
                    <StarRating
                      rating={review.rating}
                      onRatingChange={(rating) =>
                        setReview({ ...review, rating })
                      }
                    />
                  </div>

                  <Input
                    label="Review Title"
                    placeholder="Summarize your experience..."
                    value={review.title}
                    onChange={(e) =>
                      setReview({ ...review, title: e.target.value })
                    }
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={review.comment}
                      onChange={(e) =>
                        setReview({ ...review, comment: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Share details about product quality, delivery, pricing, etc..."
                      required
                    />
                  </div>

                  <Input
                    label="Order ID (Optional)"
                    placeholder="Your order reference for verification"
                    value={review.orderId}
                    onChange={(e) =>
                      setReview({ ...review, orderId: e.target.value })
                    }
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Review"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      variant="outline"
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default SupplierReview;

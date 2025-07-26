import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Button, Card, Input } from "./ui";
import toast from "react-hot-toast";

function Community() {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [newReply, setNewReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: "general", label: "General Discussion", icon: "💬" },
    { value: "suppliers", label: "Supplier Recommendations", icon: "🏭" },
    { value: "market", label: "Market Updates", icon: "📈" },
    { value: "tips", label: "Tips & Tricks", icon: "💡" },
    { value: "alerts", label: "Industry Alerts", icon: "⚠️" },
  ];

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const fetchCommunityPosts = async () => {
    try {
      setLoading(true);
      console.log("Fetching community posts...");
      const response = await fetch("http://localhost:5000/api/community");
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data);
        console.log("Posts array:", data.data);
        setPosts(data.data || []);
      } else {
        console.error(
          "Failed to fetch community posts, status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to create posts");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const postData = {
        ...newPost,
        authorId: user.uid,
        authorName:
          userProfile?.businessName || user.displayName || "Anonymous",
        authorType: userProfile?.userType || "vendor",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:5000/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success("Post created successfully! 📝");
        setNewPost({ title: "", content: "", category: "general" });
        setShowCreatePost(false);
        fetchCommunityPosts(); // Refresh posts
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (postId) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/community/${postId}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.uid }),
        }
      );

      if (response.ok) {
        fetchCommunityPosts(); // Refresh to show updated vote count
      } else {
        toast.error("Failed to record vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to record vote");
    }
  };

  const handleReply = async (postId) => {
    if (!user) {
      toast.error("Please login to reply");
      return;
    }

    if (!newReply.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const replyData = {
        content: newReply,
        authorId: user.uid,
        authorName:
          userProfile?.businessName || user.displayName || "Anonymous",
        authorType: userProfile?.userType || "vendor",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `http://localhost:5000/api/community/${postId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(replyData),
        }
      );

      if (response.ok) {
        toast.success("Reply added! 💬");
        setNewReply("");
        fetchCommunityPosts(); // Refresh posts to show new reply count
      } else {
        throw new Error("Failed to add reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.icon : "💬";
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find((c) => c.value === category);
    return cat ? cat.label : "General";
  };

  const getBorderColor = (category) => {
    switch (category) {
      case "suppliers":
        return "border-blue-500";
      case "market":
        return "border-green-500";
      case "tips":
        return "border-yellow-500";
      case "alerts":
        return "border-red-500";
      default:
        return "border-purple-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1d ago";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading community posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Post Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            💬 Vendor Community
          </h2>
          <p className="text-gray-600 mt-1">
            Connect with fellow vendors, share insights, and get recommendations
          </p>
        </div>
        <Button
          onClick={() => setShowCreatePost(true)}
          variant="primary"
          className="bg-primary-600 hover:bg-primary-700"
        >
          ✏️ Create Post
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-gray-500">
              No posts yet. Be the first to start a discussion!
            </div>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="p-6">
              <div
                className={`border-l-4 ${getBorderColor(post.category)} pl-4`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {getCategoryIcon(post.category)}{" "}
                        {getCategoryLabel(post.category)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 mb-3">{post.content}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>By: {post.authorName}</span>
                      <span>•</span>
                      <span className="capitalize">{post.authorType}</span>
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <span>👍</span>
                    <span>{post.upvotes || 0} upvotes</span>
                  </button>
                  <button
                    onClick={() =>
                      setSelectedPost(selectedPost === post.id ? null : post.id)
                    }
                    className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <span>💬</span>
                    <span>{post.replies || 0} replies</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors">
                    <span>📤</span>
                    <span>Share</span>
                  </button>
                </div>

                {/* Reply Section */}
                <AnimatePresence>
                  {selectedPost === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="flex space-x-3">
                        <textarea
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          rows={3}
                        />
                        <Button
                          onClick={() => handleReply(post.id)}
                          variant="primary"
                          size="sm"
                          disabled={!newReply.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  ✏️ Create New Post
                </h3>
                <Button
                  onClick={() => setShowCreatePost(false)}
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Title *"
                  placeholder="What's your question or topic?"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Share your thoughts, questions, or recommendations with the community..."
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={
                      submitting ||
                      !newPost.title.trim() ||
                      !newPost.content.trim()
                    }
                  >
                    {submitting ? "Posting..." : "Post to Community"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Community;

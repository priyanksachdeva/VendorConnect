import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button, Card, Input, Badge } from "../components/ui";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "Current User", // This should come from auth context
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/community`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        console.log(`💬 Loaded ${data.length} community posts`);
      } else {
        throw new Error("Failed to fetch posts");
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
    try {
      const response = await fetch(`${API_BASE_URL}/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPost,
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPost({ title: "", content: "", author: "Current User" });
        setShowCreatePost(false);
        toast.success("Post created successfully! 📝");
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="text-center py-16">
          <div className="animate-pulse text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Community...
          </h3>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              💬 Community Hub
            </h1>
            <p className="text-gray-600">
              Connect, share insights, and learn from fellow farmers and vendors
            </p>
          </div>

          <Button
            onClick={() => setShowCreatePost(true)}
            variant="primary"
            size="lg"
            className="shadow-primary"
            icon={<span>✏️</span>}
          >
            Create Post
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient" className="hover-lift">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {posts.length}
                </div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {new Set(posts.map((p) => p.author)).size}
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">
                  {
                    posts.filter(
                      (p) =>
                        new Date(p.createdAt) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">
                  {
                    posts.filter(
                      (p) =>
                        new Date(p.createdAt) >
                        new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Today</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Posts List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {posts.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Be the first to start a conversation in the community!
              </p>
              <Button
                onClick={() => setShowCreatePost(true)}
                variant="primary"
                size="lg"
                icon={<span>✏️</span>}
              >
                Create First Post
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <CommunityPostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Create Post Modal */}
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
              <Card padding="none">
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title className="flex items-center">
                      <span className="mr-2">✏️</span>
                      Create New Post
                    </Card.Title>
                    <Button
                      onClick={() => setShowCreatePost(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </div>
                </Card.Header>

                <Card.Content>
                  <form onSubmit={handleCreatePost} className="space-y-6">
                    <Input
                      label="Post Title"
                      placeholder="Share your topic..."
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      required
                    />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <textarea
                        value={newPost.content}
                        onChange={(e) =>
                          setNewPost({ ...newPost, content: e.target.value })
                        }
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        placeholder="Share your thoughts, tips, or questions with the community..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button type="submit" variant="success" size="lg">
                        Publish Post
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowCreatePost(false)}
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
    </motion.div>
  );
}

function CommunityPostCard({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  return (
    <Card className="hover-lift">
      <Card.Header>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Card.Title className="text-xl mb-2">{post.title}</Card.Title>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-1">👤</span>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">📅</span>
                <span>{getTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
          <Badge variant="info" size="sm">
            Discussion
          </Badge>
        </div>
      </Card.Header>

      <Card.Content>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </Card.Content>

      <Card.Footer>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <span className="mr-1">👍</span> Like
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <span className="mr-1">💬</span> Comment
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <span className="mr-1">📤</span> Share
            </Button>
          </div>
          <Button variant="link" size="sm" className="text-primary-600">
            Read More →
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

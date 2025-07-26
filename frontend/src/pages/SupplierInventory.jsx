import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button, Card, Input, Badge } from "../components/ui";

function SupplierInventory() {
  const { user, userProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    quantity: "",
    description: "",
    minOrder: "",
  });

  useEffect(() => {
    fetchSupplierItems();
  }, [user]);

  const fetchSupplierItems = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory?supplierId=${user.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        ...newItem,
        supplierId: user.uid,
        supplierName: userProfile?.businessName || user.displayName,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity),
        minOrder: parseInt(newItem.minOrder),
        createdAt: new Date().toISOString(),
        status: "available",
      };

      const response = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Item added to inventory:", responseData);

        // Refresh the supplier's items list
        await fetchSupplierItems();

        // Reset form
        setNewItem({
          name: "",
          category: "",
          price: "",
          unit: "",
          quantity: "",
          description: "",
          minOrder: "",
        });
        setShowAddForm(false);

        // Show success message with sync info
        alert(
          `✅ Item "${itemData.name}" added successfully!\n\n🔄 Your item is now synced with Firebase and available for vendors to order in the marketplace.`
        );
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/inventory/${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setItems(items.filter((item) => item.id !== itemId));
        toast.success("Item deleted successfully! 🗑️");
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
    }
  };

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Spices",
    "Dairy",
    "Other",
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              🏭 My Inventory
            </h1>
            <p className="text-gray-600">
              Manage your products and track market performance
            </p>
          </div>

          <Button
            onClick={() => setShowAddForm(true)}
            variant="primary"
            size="lg"
            className="shadow-primary"
            icon={<span>+</span>}
          >
            Add New Item
          </Button>
        </motion.div>

        {/* Quick Market Rates for Suppliers */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient" className="hover-lift">
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title className="flex items-center text-primary-700">
                  <span className="mr-2 text-2xl">📊</span>
                  Current Market Rates - Price Your Items Competitively
                </Card.Title>
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary-600 hover:text-primary-700"
                >
                  View All Rates →
                </Button>
              </div>
            </Card.Header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Rice (Basmati)",
                  price: "₹4,200-4,800/q",
                  change: "High Demand ↗",
                  trend: "up",
                },
                {
                  name: "Wheat",
                  price: "₹2,100-2,300/q",
                  change: "Stable ↔",
                  trend: "stable",
                },
                {
                  name: "Onion",
                  price: "₹1,800-2,200/q",
                  change: "Price Drop ↘",
                  trend: "down",
                },
                {
                  name: "Tomato",
                  price: "₹2,500-3,000/q",
                  change: "Seasonal High ↗",
                  trend: "up",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  className="bg-white rounded-xl p-4 shadow-soft border border-white/50"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      item.trend === "up"
                        ? "text-success-600"
                        : item.trend === "down"
                        ? "text-error-600"
                        : "text-secondary-600"
                    }`}
                  >
                    {item.price}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      item.trend === "up"
                        ? "text-success-600"
                        : item.trend === "down"
                        ? "text-error-600"
                        : "text-secondary-600"
                    }`}
                  >
                    {item.change}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-white/50 rounded-lg">
              <div className="text-sm text-gray-600 flex items-center">
                <span className="mr-2">💡</span>
                <strong>Tip:</strong> Price your items within 5-10% of market
                rates for competitive advantage
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Inventory Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {items.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items in inventory
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first item to start selling in the marketplace!
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="primary"
                size="lg"
                icon={<span>+</span>}
              >
                Add Your First Item
              </Button>
            </Card>
          ) : (
            <Card variant="elevated" className="shadow-medium">
              <Card.Header>
                <Card.Title>📦 Your Listed Items ({items.length})</Card.Title>
                <Card.Description>
                  Manage your inventory and track performance
                </Card.Description>
              </Card.Header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <InventoryItemCard
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>

        {/* Add Item Modal */}
        {showAddForm && (
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
                      <span className="mr-2">📦</span>
                      Add New Item
                    </Card.Title>
                    <Button
                      onClick={() => setShowAddForm(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </div>
                </Card.Header>

                <Card.Content>
                  <form onSubmit={handleAddItem} className="space-y-6">
                    <Input
                      label="Product Name"
                      name="name"
                      required
                      value={newItem.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Fresh Tomatoes"
                    />

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="category"
                        required
                        value={newItem.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Price (₹)"
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        value={newItem.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Unit
                        </label>
                        <select
                          name="unit"
                          required
                          value={newItem.unit}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        >
                          <option value="">Select Unit</option>
                          <option value="kg">Kilogram (kg)</option>
                          <option value="quintal">Quintal</option>
                          <option value="piece">Piece</option>
                          <option value="dozen">Dozen</option>
                          <option value="liter">Liter</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Available Quantity"
                        name="quantity"
                        type="number"
                        required
                        value={newItem.quantity}
                        onChange={handleInputChange}
                        placeholder="0"
                      />

                      <Input
                        label="Minimum Order"
                        name="minOrder"
                        type="number"
                        required
                        value={newItem.minOrder}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={newItem.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        placeholder="Describe your product..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        loading={loading}
                        variant="success"
                        size="lg"
                      >
                        {loading ? "Adding..." : "Add Item"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowAddForm(false)}
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

function InventoryItemCard({ item, onDelete }) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(item.id);
      toast.success(`${item.name} deleted successfully! 🗑️`);
    }
  };

  return (
    <Card className="hover-lift h-full">
      <Card.Header>
        <div className="flex justify-between items-start">
          <div>
            <Card.Title className="text-lg">{item.name}</Card.Title>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
          <Badge variant={item.quantity > 0 ? "success" : "error"} size="sm">
            {item.quantity > 0 ? "Available" : "Out of Stock"}
          </Badge>
        </div>
      </Card.Header>

      <Card.Content>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-primary-600">
              ₹{item.price}/{item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Available:</span>
            <span className="font-medium">
              {item.quantity} {item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Min Order:</span>
            <span className="font-medium">
              {item.minOrder} {item.unit}
            </span>
          </div>
        </div>
      </Card.Content>

      <Card.Footer>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-secondary-600 border-secondary-200 hover:bg-secondary-50"
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="text-error-600 border-error-200 hover:bg-error-50"
          >
            Delete
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}

export default SupplierInventory;

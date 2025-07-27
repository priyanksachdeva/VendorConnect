import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card, Input, Badge } from "./ui";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function SmartInventoryTracker() {
  const { user, userProfile } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: "",
    minThreshold: "",
    maxThreshold: "",
    unit: "kg",
    avgConsumption: "", // daily consumption rate
    reorderPoint: "",
    supplierName: "",
    lastPrice: "",
  });

  useEffect(() => {
    fetchInventory();
    fetchLowStockAlerts();
  }, [user]);

  const fetchInventory = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/smart-inventory?userId=${user.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const fetchLowStockAlerts = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/smart-inventory/alerts?userId=${user.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const calculateStockStatus = (item) => {
    const { currentStock, minThreshold, maxThreshold } = item;

    if (currentStock <= 0)
      return { status: "Out of Stock", color: "error", priority: "critical" };
    if (currentStock <= minThreshold * 0.5)
      return { status: "Critical", color: "error", priority: "high" };
    if (currentStock <= minThreshold)
      return { status: "Low Stock", color: "warning", priority: "medium" };
    if (currentStock >= maxThreshold)
      return { status: "Overstocked", color: "info", priority: "low" };
    return { status: "In Stock", color: "success", priority: "normal" };
  };

  const calculateDaysRemaining = (item) => {
    if (!item.avgConsumption || item.avgConsumption <= 0) return null;
    return Math.floor(item.currentStock / item.avgConsumption);
  };

  const getPredictedStockout = (item) => {
    const daysRemaining = calculateDaysRemaining(item);
    if (!daysRemaining) return null;

    const stockoutDate = new Date();
    stockoutDate.setDate(stockoutDate.getDate() + daysRemaining);
    return stockoutDate;
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add inventory items");
      return;
    }

    try {
      const itemData = {
        ...newItem,
        userId: user.uid,
        userType: userProfile?.userType || "vendor",
        currentStock: parseFloat(newItem.currentStock),
        minThreshold: parseFloat(newItem.minThreshold),
        maxThreshold: parseFloat(newItem.maxThreshold),
        avgConsumption: parseFloat(newItem.avgConsumption || 0),
        reorderPoint: parseFloat(newItem.reorderPoint || newItem.minThreshold),
        lastPrice: parseFloat(newItem.lastPrice || 0),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/api/smart-inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (response.ok) {
        toast.success("Item added to smart inventory! 📦");
        setNewItem({
          name: "",
          category: "",
          currentStock: "",
          minThreshold: "",
          maxThreshold: "",
          unit: "kg",
          avgConsumption: "",
          reorderPoint: "",
          supplierName: "",
          lastPrice: "",
        });
        setShowAddItem(false);
        fetchInventory();
        fetchLowStockAlerts();
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add inventory item");
    }
  };

  const updateStock = async (
    itemId,
    newStock,
    reason = "Manual adjustment"
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/smart-inventory/${itemId}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentStock: newStock,
            reason,
            lastUpdated: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        fetchInventory();
        fetchLowStockAlerts();
        toast.success("Stock updated successfully");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const generateReorderSuggestion = (item) => {
    const daysRemaining = calculateDaysRemaining(item);
    const stockStatus = calculateStockStatus(item);

    if (
      stockStatus.priority === "critical" ||
      stockStatus.priority === "high"
    ) {
      const suggestedQuantity = item.maxThreshold - item.currentStock;
      const urgency = daysRemaining && daysRemaining < 7 ? "URGENT" : "Normal";

      return {
        shouldReorder: true,
        urgency,
        suggestedQuantity,
        estimatedCost: suggestedQuantity * (item.lastPrice || 0),
        supplier: item.supplierName,
      };
    }

    return { shouldReorder: false };
  };

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Spices",
    "Dairy",
    "Packaging",
    "Other",
  ];
  const units = ["kg", "g", "l", "ml", "pieces", "boxes", "packets"];

  const criticalItems = inventory.filter((item) => {
    const status = calculateStockStatus(item);
    return status.priority === "critical" || status.priority === "high";
  });

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              📊 Smart Inventory Tracker
            </h1>
            <p className="text-gray-600">
              AI-powered stock management with predictive alerts
            </p>
          </div>

          <Button
            onClick={() => setShowAddItem(true)}
            variant="primary"
            size="lg"
            icon={<span>+</span>}
          >
            Add Item
          </Button>
        </motion.div>

        {/* Critical Alerts */}
        {criticalItems.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="error" className="border-red-300 bg-red-50">
              <Card.Header>
                <Card.Title className="text-red-800 flex items-center">
                  <span className="mr-2">🚨</span>
                  Critical Stock Alerts ({criticalItems.length})
                </Card.Title>
              </Card.Header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalItems.slice(0, 4).map((item) => {
                  const daysRemaining = calculateDaysRemaining(item);
                  const reorderSuggestion = generateReorderSuggestion(item);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-4 border border-red-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                        </div>
                        <Badge variant="error" size="sm">
                          {item.currentStock} {item.unit}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        {daysRemaining && (
                          <p>📅 {daysRemaining} days remaining</p>
                        )}
                        {reorderSuggestion.shouldReorder && (
                          <p className="text-red-600 font-medium">
                            🛒 Reorder {reorderSuggestion.suggestedQuantity}{" "}
                            {item.unit}
                            {reorderSuggestion.urgency === "URGENT" &&
                              " (URGENT)"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Inventory Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {inventory.length}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-success-600">
                {
                  inventory.filter(
                    (item) => calculateStockStatus(item).status === "In Stock"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">In Stock</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-warning-600">
                {
                  inventory.filter((item) => {
                    const status = calculateStockStatus(item).status;
                    return status === "Low Stock" || status === "Critical";
                  }).length
                }
              </div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-error-600">
                {
                  inventory.filter(
                    (item) =>
                      calculateStockStatus(item).status === "Out of Stock"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </Card>
          </div>
        </motion.div>

        {/* Inventory Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {inventory.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items in inventory
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first item to start smart inventory tracking!
              </p>
              <Button
                onClick={() => setShowAddItem(true)}
                variant="primary"
                size="lg"
              >
                Add First Item
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map((item, index) => {
                const stockStatus = calculateStockStatus(item);
                const daysRemaining = calculateDaysRemaining(item);
                const reorderSuggestion = generateReorderSuggestion(item);
                const predictedStockout = getPredictedStockout(item);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="hover-lift h-full">
                      <Card.Header>
                        <div className="flex justify-between items-start">
                          <div>
                            <Card.Title className="text-lg">
                              {item.name}
                            </Card.Title>
                            <p className="text-sm text-gray-600">
                              {item.category}
                            </p>
                          </div>
                          <Badge variant={stockStatus.color} size="sm">
                            {stockStatus.status}
                          </Badge>
                        </div>
                      </Card.Header>

                      <Card.Content>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Current Stock:
                            </span>
                            <span className="font-semibold">
                              {item.currentStock} {item.unit}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Min Threshold:
                            </span>
                            <span>
                              {item.minThreshold} {item.unit}
                            </span>
                          </div>
                          {daysRemaining && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Days Remaining:
                              </span>
                              <span
                                className={
                                  daysRemaining < 7
                                    ? "text-red-600 font-semibold"
                                    : ""
                                }
                              >
                                {daysRemaining} days
                              </span>
                            </div>
                          )}
                          {predictedStockout && (
                            <div className="text-xs text-gray-500">
                              📅 Predicted stockout:{" "}
                              {predictedStockout.toLocaleDateString()}
                            </div>
                          )}
                          {item.supplierName && (
                            <div className="text-xs text-gray-500">
                              🏪 Supplier: {item.supplierName}
                            </div>
                          )}
                        </div>

                        {reorderSuggestion.shouldReorder && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="text-sm font-medium text-yellow-800">
                              🛒 Reorder Suggestion
                            </div>
                            <div className="text-xs text-yellow-700 mt-1">
                              Order {reorderSuggestion.suggestedQuantity}{" "}
                              {item.unit}
                              {reorderSuggestion.estimatedCost > 0 && (
                                <span>
                                  {" "}
                                  (Est. ₹
                                  {reorderSuggestion.estimatedCost.toFixed(2)})
                                </span>
                              )}
                            </div>
                            {reorderSuggestion.urgency === "URGENT" && (
                              <Badge variant="error" size="sm" className="mt-1">
                                URGENT
                              </Badge>
                            )}
                          </div>
                        )}
                      </Card.Content>

                      <Card.Footer>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            onClick={() =>
                              updateStock(
                                item.id,
                                Math.max(0, item.currentStock - 1),
                                "Usage"
                              )
                            }
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            -1
                          </Button>
                          <Button
                            onClick={() => {
                              const newStock = prompt(
                                `Update stock for ${item.name}:`,
                                item.currentStock
                              );
                              if (newStock !== null && !isNaN(newStock)) {
                                updateStock(
                                  item.id,
                                  parseFloat(newStock),
                                  "Manual update"
                                );
                              }
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() =>
                              updateStock(
                                item.id,
                                item.currentStock +
                                  parseInt(item.reorderPoint || 10),
                                "Restock"
                              )
                            }
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                          >
                            +Stock
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Add Item Modal */}
        {showAddItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-strong"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card padding="none">
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title>📦 Add Smart Inventory Item</Card.Title>
                    <Button
                      onClick={() => setShowAddItem(false)}
                      variant="ghost"
                      size="sm"
                    >
                      ✕
                    </Button>
                  </div>
                </Card.Header>

                <Card.Content>
                  <form onSubmit={handleAddItem} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Item Name"
                        placeholder="e.g., Tomatoes, Rice"
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({ ...newItem, category: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="Current Stock"
                        type="number"
                        step="0.01"
                        placeholder="100"
                        value={newItem.currentStock}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            currentStock: e.target.value,
                          })
                        }
                        required
                      />

                      <Input
                        label="Min Threshold"
                        type="number"
                        step="0.01"
                        placeholder="20"
                        value={newItem.minThreshold}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            minThreshold: e.target.value,
                          })
                        }
                        required
                      />

                      <Input
                        label="Max Threshold"
                        type="number"
                        step="0.01"
                        placeholder="200"
                        value={newItem.maxThreshold}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            maxThreshold: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit
                        </label>
                        <select
                          value={newItem.unit}
                          onChange={(e) =>
                            setNewItem({ ...newItem, unit: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {units.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="Daily Consumption Rate"
                        type="number"
                        step="0.01"
                        placeholder="5.0"
                        value={newItem.avgConsumption}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            avgConsumption: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Supplier Name (Optional)"
                        placeholder="Fresh Vegetables Hub"
                        value={newItem.supplierName}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            supplierName: e.target.value,
                          })
                        }
                      />

                      <Input
                        label="Last Purchase Price (₹)"
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        value={newItem.lastPrice}
                        onChange={(e) =>
                          setNewItem({ ...newItem, lastPrice: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="submit" variant="success" size="lg">
                        Add to Inventory
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowAddItem(false)}
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

export default SmartInventoryTracker;

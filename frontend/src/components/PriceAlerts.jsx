import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";
import { motion } from "framer-motion";
import { Button, Card, Input, Badge } from "./ui";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

function PriceAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    itemName: "",
    category: "",
    targetPrice: "",
    currentPrice: "",
    alertType: "below", // below, above
    isActive: true,
  });
  const [frequentlyBought, setFrequentlyBought] = useState([]);

  useEffect(() => {
    fetchUserAlerts();
    fetchFrequentlyBought();
    // Set up interval to check for price changes
    const interval = setInterval(checkPriceAlerts, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [user]);

  const fetchUserAlerts = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/price-alerts?userId=${user.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const fetchFrequentlyBought = async () => {
    if (!user) return;
    try {
      // Get user's order history to suggest frequently bought items
      const response = await fetch(
        `${API_BASE_URL}/api/orders?userId=${user.uid}&limit=50`
      );
      if (response.ok) {
        const orders = await response.json();
        const itemCounts = {};

        orders.forEach((order) => {
          order.items?.forEach((item) => {
            itemCounts[item.itemName] = (itemCounts[item.itemName] || 0) + 1;
          });
        });

        const frequent = Object.entries(itemCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([name, count]) => ({ name, count }));

        setFrequentlyBought(frequent);
      }
    } catch (error) {
      console.error("Error fetching frequently bought items:", error);
    }
  };

  const checkPriceAlerts = async () => {
    if (!user || alerts.length === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/price-alerts/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (response.ok) {
        const triggeredAlerts = await response.json();

        triggeredAlerts.forEach((alert) => {
          if (alert.triggered) {
            // Show browser notification if permission granted
            if (Notification.permission === "granted") {
              new Notification("Price Alert!", {
                body: `${alert.itemName} is now ₹${alert.currentPrice} (Target: ₹${alert.targetPrice})`,
                icon: "/favicon.ico",
              });
            }

            // Show toast notification
            toast.success(
              `💰 Price Alert: ${alert.itemName} hit your target price!`
            );
          }
        });
      }
    } catch (error) {
      console.error("Error checking price alerts:", error);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to create price alerts");
      return;
    }

    try {
      const alertData = {
        ...newAlert,
        userId: user.uid,
        targetPrice: parseFloat(newAlert.targetPrice),
        currentPrice: parseFloat(newAlert.currentPrice || 0),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/api/price-alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        toast.success(
          "Price alert created! You'll be notified when target is reached 🔔"
        );
        setNewAlert({
          itemName: "",
          category: "",
          targetPrice: "",
          currentPrice: "",
          alertType: "below",
          isActive: true,
        });
        setShowCreateAlert(false);
        fetchUserAlerts();
      } else {
        throw new Error("Failed to create alert");
      }
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create price alert");
    }
  };

  const toggleAlert = async (alertId, isActive) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/price-alerts/${alertId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive }),
        }
      );

      if (response.ok) {
        setAlerts(
          alerts.map((alert) =>
            alert.id === alertId ? { ...alert, isActive } : alert
          )
        );
        toast.success(
          `Alert ${isActive ? "activated" : "paused"} successfully`
        );
      }
    } catch (error) {
      console.error("Error toggling alert:", error);
      toast.error("Failed to update alert");
    }
  };

  const deleteAlert = async (alertId) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/price-alerts/${alertId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAlerts(alerts.filter((alert) => alert.id !== alertId));
        toast.success("Alert deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Failed to delete alert");
    }
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success(
            "Notifications enabled! You'll get price alerts even when the app is closed."
          );
        }
      });
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
              🔔 Smart Price Alerts
            </h1>
            <p className="text-gray-600">
              Get notified when your frequently bought items hit target prices
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={requestNotificationPermission}
              variant="outline"
              size="sm"
              className="text-primary-600"
            >
              🔔 Enable Notifications
            </Button>
            <Button
              onClick={() => setShowCreateAlert(true)}
              variant="primary"
              size="lg"
              icon={<span>+</span>}
            >
              Create Alert
            </Button>
          </div>
        </motion.div>

        {/* Quick Add from Frequently Bought */}
        {frequentlyBought.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="gradient" className="hover-lift">
              <Card.Header>
                <Card.Title className="flex items-center text-primary-700">
                  <span className="mr-2">📈</span>
                  Frequently Bought Items - Set Price Alerts
                </Card.Title>
              </Card.Header>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {frequentlyBought.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="bg-white rounded-lg p-4 shadow-soft border cursor-pointer hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setNewAlert({
                        ...newAlert,
                        itemName: item.name,
                        category: "Vegetables", // Default, user can change
                      });
                      setShowCreateAlert(true);
                    }}
                  >
                    <div className="font-semibold text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Ordered {item.count} times
                    </div>
                    <div className="text-xs text-primary-600 mt-1">
                      Click to set alert
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Active Alerts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <Card.Header>
              <Card.Title>Your Price Alerts ({alerts.length})</Card.Title>
            </Card.Header>

            {alerts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No price alerts set
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first alert to get notified when prices drop!
                </p>
                <Button
                  onClick={() => setShowCreateAlert(true)}
                  variant="primary"
                  size="lg"
                >
                  Create First Alert
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {alert.itemName}
                          </h4>
                          <Badge
                            variant={alert.isActive ? "success" : "secondary"}
                            size="sm"
                          >
                            {alert.isActive ? "Active" : "Paused"}
                          </Badge>
                          <Badge variant="info" size="sm">
                            {alert.category}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          Alert when price goes{" "}
                          <span className="font-medium">
                            {alert.alertType} ₹{alert.targetPrice}
                          </span>
                          {alert.currentPrice && (
                            <span className="ml-2">
                              (Current: ₹{alert.currentPrice})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created{" "}
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => toggleAlert(alert.id, !alert.isActive)}
                          variant="ghost"
                          size="sm"
                          className={
                            alert.isActive
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        >
                          {alert.isActive ? "Pause" : "Activate"}
                        </Button>
                        <Button
                          onClick={() => deleteAlert(alert.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Create Alert Modal */}
        {showCreateAlert && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-strong"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card padding="none">
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title>🔔 Create Price Alert</Card.Title>
                    <Button
                      onClick={() => setShowCreateAlert(false)}
                      variant="ghost"
                      size="sm"
                    >
                      ✕
                    </Button>
                  </div>
                </Card.Header>

                <Card.Content>
                  <form onSubmit={handleCreateAlert} className="space-y-6">
                    <Input
                      label="Item Name"
                      placeholder="e.g., Tomatoes, Rice, Onions"
                      value={newAlert.itemName}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, itemName: e.target.value })
                      }
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newAlert.category}
                        onChange={(e) =>
                          setNewAlert({ ...newAlert, category: e.target.value })
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

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Target Price (₹)"
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        value={newAlert.targetPrice}
                        onChange={(e) =>
                          setNewAlert({
                            ...newAlert,
                            targetPrice: e.target.value,
                          })
                        }
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alert Type
                        </label>
                        <select
                          value={newAlert.alertType}
                          onChange={(e) =>
                            setNewAlert({
                              ...newAlert,
                              alertType: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="below">
                            Price drops below target
                          </option>
                          <option value="above">
                            Price rises above target
                          </option>
                        </select>
                      </div>
                    </div>

                    <Input
                      label="Current Price (₹) - Optional"
                      type="number"
                      step="0.01"
                      placeholder="60.00"
                      value={newAlert.currentPrice}
                      onChange={(e) =>
                        setNewAlert({
                          ...newAlert,
                          currentPrice: e.target.value,
                        })
                      }
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="submit" variant="success" size="lg">
                        Create Alert
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowCreateAlert(false)}
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

export default PriceAlerts;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button, Card, Input, Badge } from "../components/ui";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        console.log(`📦 Loaded ${data.length} orders`);
      } else {
        throw new Error("Failed to fetch orders");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchOrders();
        toast.success(`Order status updated to ${newStatus}! 📋`);
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUniqueStatuses = () => {
    return [...new Set(orders.map((order) => order.status))];
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some(
            (item) =>
              item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.supplierName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUniqueStatuses = () => {
    return [...new Set(orders.map((order) => order.status))];
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
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
          <div className="animate-spin text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Orders...
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
              📦 Orders Management
            </h1>
            <p className="text-gray-600">
              Track and manage all your orders in one place
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="info" size="lg">
              {filteredOrders.length} of {orders.length} orders
            </Badge>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated" className="shadow-medium">
            <Card.Header>
              <Card.Title>🔍 Search & Filter Orders</Card.Title>
              <Card.Description>
                Find specific orders quickly using filters
              </Card.Description>
            </Card.Header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Search Orders"
                placeholder="Search by order ID, vendor, or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<span>🔍</span>}
                iconPosition="left"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                >
                  <option value="">All Statuses</option>
                  {getUniqueStatuses().map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {orders.length === 0
                  ? "No orders have been placed yet."
                  : "Try adjusting your search criteria."}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <OrderCard order={order} onUpdateStatus={updateOrderStatus} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function OrderCard({ order, onUpdateStatus }) {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusActions = (status, orderId) => {
    const actions = [];

    switch (status.toLowerCase()) {
      case "pending":
        actions.push(
          <Button
            key="confirm"
            onClick={() => onUpdateStatus(orderId, "confirmed")}
            variant="success"
            size="sm"
          >
            Confirm Order
          </Button>
        );
        actions.push(
          <Button
            key="cancel"
            onClick={() => onUpdateStatus(orderId, "cancelled")}
            variant="error"
            size="sm"
          >
            Cancel
          </Button>
        );
        break;
      case "confirmed":
        actions.push(
          <Button
            key="deliver"
            onClick={() => onUpdateStatus(orderId, "delivered")}
            variant="success"
            size="sm"
          >
            Mark as Delivered
          </Button>
        );
        break;
    }

    actions.push(
      <Button key="details" variant="outline" size="sm">
        View Details
      </Button>
    );

    return actions;
  };

  return (
    <Card className="hover-lift">
      <Card.Header>
        <div className="flex justify-between items-start">
          <div>
            <Card.Title className="text-lg">
              Order #{order.id?.slice(-8)}
            </Card.Title>
            <p className="text-sm text-gray-600">From: {order.vendorName}</p>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusVariant(order.status)} size="lg">
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </Badge>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Total Items</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.items?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Total Amount</p>
              <p className="text-lg font-semibold text-primary-600">
                ₹{order.totalAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Order Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Order Items:
            </h4>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.itemName}</p>
                    <p className="text-sm text-gray-600">
                      Supplier: {item.supplierName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {item.quantity} × ₹{item.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      = ₹{(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card.Content>

      <Card.Footer>
        <div className="flex flex-wrap gap-2">
          {getStatusActions(order.status, order.id)}
        </div>
      </Card.Footer>
    </Card>
  );
}

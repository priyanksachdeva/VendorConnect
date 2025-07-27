import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import API_BASE_URL from "../config/api";

function OrdersPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Safely determine user type
  const isVendor = userProfile?.userType === "vendor";
  const isSupplier = userProfile?.userType === "supplier";



  useEffect(() => {
    if (!authLoading && user && userProfile) {
      fetchOrders();
    }
  }, [user, userProfile, authLoading]);

  const fetchOrders = async (isRefresh = false) => {
    if (!user || !userProfile) return;

    if (isRefresh) {
      setRefreshing(true);
    }

    try {


      let url = `${API_BASE_URL}/api/orders`;

      if (isVendor) {
        url += `?vendorId=${user.uid}`;
      } else if (isSupplier) {
        url += `?supplierId=${user.uid}`;
      }

      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        // Handle both old format (direct array) and new format (with data property)
        const ordersData = result.data || result;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        console.error("Failed to fetch orders:", response.statusText);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusActions = (order) => {
    if (isSupplier) {
      switch (order.status) {
        case "pending":
          return (
            <div className="space-x-2">
              <button
                onClick={() => updateOrderStatus(order.id, "confirmed")}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, "cancelled")}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          );
        case "confirmed":
          return (
            <button
              onClick={() => updateOrderStatus(order.id, "processing")}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Start Processing
            </button>
          );
        case "processing":
          return (
            <button
              onClick={() => updateOrderStatus(order.id, "shipped")}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
            >
              Mark as Shipped
            </button>
          );
        case "shipped":
          return (
            <button
              onClick={() => updateOrderStatus(order.id, "delivered")}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
            >
              Mark as Delivered
            </button>
          );
        default:
          return null;
      }
    }
    return null;
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading user profile...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          📋 {isVendor ? "My Orders" : "Orders to Fulfill"}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Total: {orders.length} orders
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Orders Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {["pending", "confirmed", "processing", "delivered"].map((status) => {
          const count = orders.filter(
            (order) => order.status === status
          ).length;
          return (
            <div
              key={status}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {isVendor ? "Your Orders" : "Incoming Orders"}
          </h3>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No orders found.</p>

          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Order #{order.id?.slice(-8)}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        {isVendor
                          ? `To: ${order.supplierName}`
                          : `From: ${order.vendorName}`}
                      </p>
                      {/* Show contact information based on user role */}
                      {isVendor && order.items?.[0]?.supplierPhone && (
                        <p className="flex items-center text-green-600">
                          <span className="mr-1">📞</span>
                          <span>{order.items[0].supplierPhone}</span>
                        </p>
                      )}
                      {isSupplier && order.vendorPhone && (
                        <p className="flex items-center text-green-600">
                          <span className="mr-1">📞</span>
                          <span>{order.vendorPhone}</span>
                        </p>
                      )}
                      <p>
                        Placed: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                      ₹{order.totalAmount}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-2">
                    Order Items:
                  </h5>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.itemName}</span>
                        <span>
                          {item.quantity} {item.unit} × ₹{item.price} = ₹
                          {(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {getStatusActions(order) && (
                  <div className="flex justify-end">
                    {getStatusActions(order)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;

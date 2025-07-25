import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

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
      const response = await axios.get("http://localhost:5000/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}`, {
        status: newStatus,
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUniqueStatuses = () => {
    return [...new Set(orders.map((order) => order.status))];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Orders Management
        </h2>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by order number or supplier..."
          />
          <FilterDropdown
            options={getUniqueStatuses()}
            value={statusFilter}
            onChange={setStatusFilter}
            label="Status"
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  Supplier: {order.supplier}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Order Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Expected Delivery
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(order.expectedDelivery)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Total Amount
                </p>
                <p className="text-sm text-gray-600">
                  ${order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
              <div className="bg-gray-50 rounded p-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-sm text-gray-700">
                      {item.name} (SKU: {item.sku})
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.quantity} × ${item.unitPrice} = $
                      {(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Tracking Number
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  {order.trackingNumber}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {order.status === "Pending" && (
                <button
                  onClick={() => updateOrderStatus(order.id, "Confirmed")}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
              )}
              {order.status === "Confirmed" && (
                <button
                  onClick={() => updateOrderStatus(order.id, "Shipped")}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                >
                  Mark as Shipped
                </button>
              )}
              {order.status === "Shipped" && (
                <button
                  onClick={() => updateOrderStatus(order.id, "Delivered")}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Mark as Delivered
                </button>
              )}
              <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors">
                View Details
              </button>
              {order.status === "Pending" && (
                <button
                  onClick={() => updateOrderStatus(order.id, "Cancelled")}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No orders found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}

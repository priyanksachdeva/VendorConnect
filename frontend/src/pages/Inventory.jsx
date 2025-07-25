import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, statusFilter, categoryFilter]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/inventory");
      setInventory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/inventory/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredInventory(filtered);
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      await axios.patch(`http://localhost:5000/inventory/${id}/quantity`, {
        quantity: newQuantity,
        reason: "Manual adjustment",
      });
      fetchInventory();
      fetchStats();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const getUniqueCategories = () => {
    return [...new Set(inventory.map((item) => item.category))];
  };

  const getUniqueStatuses = () => {
    return [...new Set(inventory.map((item) => item.status))];
  };

  const StatCard = ({ title, value, subtitle, color = "blue" }) => (
    <div
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${color}-500`}
    >
      <div className="flex items-center">
        <div>
          <p className={`text-${color}-600 text-sm font-medium`}>{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Stats */}
      {stats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inventory Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Items"
              value={stats.totalItems}
              color="blue"
            />
            <StatCard
              title="Total Value"
              value={`$${stats.totalValue.toLocaleString()}`}
              color="green"
            />
            <StatCard
              title="Low Stock Alerts"
              value={stats.lowStockItems}
              subtitle={`${stats.outOfStockItems} out of stock`}
              color="yellow"
            />
            <StatCard
              title="Categories"
              value={stats.categories}
              color="purple"
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Inventory Items
        </h3>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search items, SKU, or description..."
          />
          <FilterDropdown
            options={getUniqueStatuses()}
            value={statusFilter}
            onChange={setStatusFilter}
            label="Status"
          />
          <FilterDropdown
            options={getUniqueCategories()}
            value={categoryFilter}
            onChange={setCategoryFilter}
            label="Categories"
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredInventory.length} of {inventory.length} items
        </p>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.quantity} / {item.maxQuantity}
                    </div>
                    <div className="text-xs text-gray-500">
                      Min: {item.minQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.unitPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-green-600 hover:text-green-900"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(0, item.quantity - 1))
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      -
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No inventory items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}

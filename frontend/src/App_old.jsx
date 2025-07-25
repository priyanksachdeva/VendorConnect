import { useState } from "react";

// Simple working components
function SimpleMarketplace() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">🏪 Marketplace</h2>

      {/* Live Mandi Prices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">🌾</span>
          Live Mandi Prices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900">Tomato</h4>
            <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mb-2">
              Delhi
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min Price:</span>
                <span className="font-medium text-green-600">₹800/Quintal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Price:</span>
                <span className="font-medium text-red-600">₹1200/Quintal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Modal Price:</span>
                <span className="font-medium text-blue-600">₹1000/Quintal</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900">Onion</h4>
            <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mb-2">
              Mumbai
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min Price:</span>
                <span className="font-medium text-green-600">
                  ₹1500/Quintal
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Price:</span>
                <span className="font-medium text-red-600">₹2000/Quintal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Modal Price:</span>
                <span className="font-medium text-blue-600">₹1750/Quintal</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900">Potato</h4>
            <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mb-2">
              Kolkata
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min Price:</span>
                <span className="font-medium text-green-600">₹600/Quintal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Price:</span>
                <span className="font-medium text-red-600">₹900/Quintal</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Modal Price:</span>
                <span className="font-medium text-blue-600">₹750/Quintal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Featured Suppliers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Fresh Vegetables Hub
                </h4>
                <p className="text-sm text-gray-600">Vegetables</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="ml-1 text-sm text-gray-600">4.8</span>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              📍 Azadpur Mandi, Delhi (2.5 km)
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Min Order: ₹1000</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                Contact
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  Spice King Wholesale
                </h4>
                <p className="text-sm text-gray-600">Spices</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★★★★☆</span>
                  <span className="ml-1 text-sm text-gray-600">4.5</span>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              📍 Khari Baoli, Delhi (3.8 km)
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Min Order: ₹500</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                Contact
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Grain Masters</h4>
                <p className="text-sm text-gray-600">Grains</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="ml-1 text-sm text-gray-600">4.9</span>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              📍 Najafgarh, Delhi (12.1 km)
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Min Order: ₹2000</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleInventory() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        📦 Inventory Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600">24</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">5</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">₹45,230</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Current Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
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
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Tomatoes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Vegetables
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  500 kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    In Stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Fresh Vegetables Hub
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Turmeric Powder
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Spices
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  200 kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    In Stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Spice King Wholesale
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Basmati Rice
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Grains
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  25 kg
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                    Low Stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Grain Masters
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SimpleCommunity() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">💬 Vendor Community</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Discussions</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                Best suppliers for organic vegetables?
              </h4>
              <span className="text-sm text-gray-500">2h ago</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Looking for reliable organic vegetable suppliers in Delhi NCR. Any
              recommendations?
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👍 12 upvotes</span>
              <span>💬 8 replies</span>
              <span>By: Ravi Kumar</span>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                Wholesale rice prices dropping!
              </h4>
              <span className="text-sm text-gray-500">5h ago</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Great news! Rice prices have dropped by 10% this week. Good time
              to stock up.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👍 25 upvotes</span>
              <span>💬 15 replies</span>
              <span>By: Priya Sharma</span>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                New spice supplier in Khari Baoli
              </h4>
              <span className="text-sm text-gray-500">1d ago</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Found an excellent new supplier for premium spices. Great quality
              and competitive prices!
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👍 18 upvotes</span>
              <span>💬 12 replies</span>
              <span>By: Amit Singh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleOrders() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">🛒 Order Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">3</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-2xl font-bold text-red-600">1</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ORD-2025-001
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Fresh Vegetables Hub
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Tomatoes, Onions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹2,500
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Delivered
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ORD-2025-002
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Spice King Wholesale
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Turmeric, Chili Powder
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹1,250
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("marketplace");

  const navItems = [
    { id: "marketplace", label: "Marketplace", icon: "🏪" },
    { id: "inventory", label: "Inventory", icon: "📦" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "community", label: "Community", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                VendorConnect
              </h1>
              <span className="ml-2 text-sm text-gray-500">
                Vendor Management Platform
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Demo User</span>
                <button className="text-gray-500 hover:text-gray-700 text-sm">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === item.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full py-6 px-4 sm:px-6 lg:px-8">
        {tab === "marketplace" && <SimpleMarketplace />}
        {tab === "inventory" && <SimpleInventory />}
        {tab === "orders" && <SimpleOrders />}
        {tab === "community" && <SimpleCommunity />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 VendorConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

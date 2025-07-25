import React from "react";

const SimpleMarketplace = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        VendorConnect Marketplace
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          🏪 Welcome to VendorConnect!
        </h2>
        <p className="text-gray-600 mb-4">
          Your platform for connecting with trusted suppliers and managing your
          vendor relationships.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🏪</div>
            <div className="font-medium">Marketplace</div>
            <div className="text-sm text-gray-600">Find Suppliers</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-medium">Inventory</div>
            <div className="text-sm text-gray-600">Manage Stock</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-medium">Orders</div>
            <div className="text-sm text-gray-600">Track Purchases</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-medium">Community</div>
            <div className="text-sm text-gray-600">Connect & Share</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          🌾 Live Mandi Prices (Demo)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="font-medium">Tomato</div>
            <div className="text-sm text-gray-600">Delhi Market</div>
            <div className="text-lg font-semibold text-green-600">
              ₹1000/Quintal
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="font-medium">Onion</div>
            <div className="text-sm text-gray-600">Mumbai Market</div>
            <div className="text-lg font-semibold text-green-600">
              ₹1750/Quintal
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="font-medium">Potato</div>
            <div className="text-sm text-gray-600">Kolkata Market</div>
            <div className="text-lg font-semibold text-green-600">
              ₹750/Quintal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMarketplace;

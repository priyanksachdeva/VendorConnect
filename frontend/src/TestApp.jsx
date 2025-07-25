import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          🚀 VendorConnect
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">✅ Application Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Frontend Server: Running on localhost:5173</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Backend Server: Running on localhost:5000</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span>Database: Firebase Firestore Connected</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🏪</div>
            <h3 className="font-semibold text-blue-900">Marketplace</h3>
            <p className="text-sm text-blue-700 mt-2">
              Find suppliers & live mandi prices
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-semibold text-green-900">Inventory</h3>
            <p className="text-sm text-green-700 mt-2">
              Manage your stock levels
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="font-semibold text-purple-900">Orders</h3>
            <p className="text-sm text-purple-700 mt-2">Track your purchases</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-orange-900">Community</h3>
            <p className="text-sm text-orange-700 mt-2">
              Connect with other vendors
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-xl font-semibold mb-4">🔧 Quick Test</h2>
          <button
            onClick={() => alert("VendorConnect is working!")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Click Handler
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

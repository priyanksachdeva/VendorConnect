import { useState } from "react";
import VendorMarketplace from "./pages/VendorMarketplace";
import { Button, Card, Input, Badge } from "./components/ui";

// Mock auth context for testing
const mockUser = {
  uid: "test-user-123",
  email: "test@example.com",
};

const mockUserProfile = {
  userType: "vendor",
  businessName: "Test Business",
  contactNumber: "9999999999",
  address: "Test Address",
};

// Simple mock useAuth hook
const useAuth = () => {
  return {
    user: mockUser,
    userProfile: mockUserProfile,
    loading: false,
    isVendor: true,
    isSupplier: false,
    logout: () => console.log("Mock logout"),
  };
};

function TestApp() {
  const { user, userProfile, logout, isVendor, isSupplier } = useAuth();
  const [tab, setTab] = useState("marketplace");

  const navItems = [
    { id: "marketplace", label: "Marketplace", icon: "🛒" },
    { id: "orders", label: "My Orders", icon: "📋" },
    { id: "rates", label: "Market Rates", icon: "📈" },
    { id: "community", label: "Community", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                🌾 VendorConnect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {userProfile?.businessName || "Test User"}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
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
        {tab === "marketplace" && <VendorMarketplace />}
        {tab === "orders" && (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">📋 Orders Page</h2>
            <p>Orders functionality coming soon...</p>
          </div>
        )}
        {tab === "rates" && (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">📈 Market Rates</h2>
            <p>Market rates functionality coming soon...</p>
          </div>
        )}
        {tab === "community" && (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">💬 Community</h2>
            <p>Community functionality coming soon...</p>
          </div>
        )}
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

export default TestApp;

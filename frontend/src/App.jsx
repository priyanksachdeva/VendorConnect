import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import VendorMarketplace from "./pages/VendorMarketplace";
import SupplierInventory from "./pages/SupplierInventory";
import OrdersPage from "./pages/OrdersPage";
import MarketRates from "./components/MarketRates";
import ErrorBoundary from "./components/ErrorBoundary";
import SmartInventoryTracker from "./components/SmartInventoryTracker";
import PriceAlerts from "./components/PriceAlerts";
import FeaturesDemo from "./pages/FeaturesDemo";
import Community from "./components/Community";

// Simple working components for general pages
function MainApp() {
  const { user, userProfile, logout, isVendor, isSupplier } = useAuth();
  const [tab, setTab] = useState(isVendor ? "marketplace" : "inventory");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    if (isVendor) {
      return [
        { id: "marketplace", label: "Marketplace", icon: "🛒" },
        { id: "orders", label: "My Orders", icon: "📋" },
        { id: "inventory", label: "Smart Inventory", icon: "📦" },
        { id: "price-alerts", label: "Price Alerts", icon: "🔔" },
        { id: "rates", label: "Market Rates", icon: "📈" },
        { id: "community", label: "Community", icon: "💬" },
        { id: "demo", label: "New Features", icon: "🚀" },
      ];
    } else if (isSupplier) {
      return [
        { id: "inventory", label: "My Inventory", icon: "📦" },
        { id: "orders", label: "Orders", icon: "📋" },
        { id: "rates", label: "Market Rates", icon: "📈" },
        { id: "community", label: "Community", icon: "💬" },
        { id: "demo", label: "New Features", icon: "🚀" },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

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
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {userProfile?.businessName || user?.displayName || "User"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {isVendor
                      ? "🛒 Vendor"
                      : isSupplier
                      ? "🏭 Supplier"
                      : "User"}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 text-sm bg-gray-100 px-3 py-1 rounded-md"
                >
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
        <ErrorBoundary>
          {/* Vendor Pages */}
          {isVendor && tab === "marketplace" && <VendorMarketplace />}
          {isVendor && tab === "inventory" && <SmartInventoryTracker />}
          {isVendor && tab === "price-alerts" && <PriceAlerts />}

          {/* Supplier Pages */}
          {isSupplier && tab === "inventory" && <SupplierInventory />}

          {/* Common Pages */}
          {tab === "orders" && <OrdersPage />}
          {tab === "rates" && <MarketRates />}
          {tab === "community" && <Community />}
          {tab === "demo" && <FeaturesDemo />}
        </ErrorBoundary>
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <MainApp />;
}

export default App;

import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPageWithHero from "./pages/LoginPageWithHero";
import VendorMarketplace from "./pages/VendorMarketplace";
import SupplierInventory from "./pages/SupplierInventory";
import OrdersPage from "./pages/OrdersPage";
import MarketRates from "./components/MarketRates";
import ErrorBoundary from "./components/ErrorBoundary";
import SmartInventoryTracker from "./components/SmartInventoryTracker";
import PriceAlerts from "./components/PriceAlerts";
import FeaturesDemo from "./pages/FeaturesDemo";
import Community from "./components/Community";
import { GooeyText } from "./components/ui/gooey-text-morphing";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";

// Simple working components for general pages
function MainApp() {
  const { user, userProfile, logout, isVendor, isSupplier } = useAuth();
  const [tab, setTab] = useState(isVendor ? "marketplace" : "inventory");

  console.log("MainApp Debug:", {
    user: !!user,
    userProfile,
    isVendor,
    isSupplier,
    userType: userProfile?.userType,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // If user is logged in but no profile exists, show a message
  if (user && !userProfile) {
    const createMissingProfile = async (selectedUserType) => {
      try {
        // Create a profile with the selected user type
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          userType: selectedUserType,
          businessName:
            user.displayName || user.email?.split("@")[0] || "My Business",
          contactNumber: "",
          address: "",
          createdAt: new Date().toISOString(),
          loginMethod: "google",
        });

        // Refresh the page to reload the profile
        window.location.reload();
      } catch (error) {
        console.error("Error creating profile:", error);
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-xl text-gray-600 mb-4">
            Complete Your Profile
          </div>
          <div className="text-sm text-gray-500 mb-6">
            User: {user.email || user.displayName}
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 gap-3 mb-4">
              <button
                onClick={() => createMissingProfile("vendor")}
                className="p-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🛒</span>
                  <div>
                    <div className="font-medium text-blue-700">
                      Street Vendor
                    </div>
                    <div className="text-sm text-gray-500">
                      I sell products directly to customers
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => createMissingProfile("supplier")}
                className="p-4 rounded-lg border border-green-200 hover:bg-green-50 transition-all text-left"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏭</span>
                  <div>
                    <div className="font-medium text-green-700">Supplier</div>
                    <div className="text-sm text-gray-500">
                      I supply products to vendors
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

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
              <div className="h-16 flex items-center">
                <GooeyText
                  texts={[
                    "VendorConnect",
                    "Marketplace",
                    "Community",
                    "Growth",
                  ]}
                  morphTime={1.2}
                  cooldownTime={0.8}
                />
              </div>
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
          {isVendor && tab === "marketplace" && (
            <VendorMarketplace setTab={setTab} />
          )}
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
    return <LoginPageWithHero />;
  }

  return <MainApp />;
}

export default App;

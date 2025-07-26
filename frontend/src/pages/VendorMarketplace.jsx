import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  Input,
  Badge,
  SearchWithSuggestions,
  AdvancedFilter,
  ChartCard,
} from "../components/ui";
import SupplierReview from "../components/SupplierReview";

function VendorMarketplace() {
  const { user, userProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: "", max: "" },
    suppliers: [],
    availability: "",
    sortBy: "",
    location: "",
  });

  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState({
    categoryDistribution: [
      { label: "Vegetables", value: 45 },
      { label: "Fruits", value: 30 },
      { label: "Grains", value: 15 },
      { label: "Dairy", value: 10 },
    ],
    priceTrends: [
      { label: "Jan", value: 100 },
      { label: "Feb", value: 110 },
      { label: "Mar", value: 105 },
      { label: "Apr", value: 115 },
      { label: "May", value: 120 },
      { label: "Jun", value: 118 },
    ],
    monthlySales: [
      { label: "Jan", value: 1200 },
      { label: "Feb", value: 1350 },
      { label: "Mar", value: 1150 },
      { label: "Apr", value: 1400 },
      { label: "May", value: 1600 },
      { label: "Jun", value: 1450 },
    ],
    supplierPerformance: [
      { label: "FreshFarms Co.", value: 85 },
      { label: "GreenHarvest", value: 78 },
      { label: "OrganicProduce", value: 92 },
      { label: "LocalFarmers", value: 73 },
    ],
    totalProducts: 248,
    totalSuppliers: 32,
    avgPrice: "125",
    trendingCategories: ["Vegetables", "Fruits", "Organic"],
  });

  useEffect(() => {
    fetchMarketplaceItems();
    // Set up interval to refresh marketplace items every 30 seconds
    const interval = setInterval(fetchMarketplaceItems, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate search suggestions based on items
  useEffect(() => {
    if (items.length > 0) {
      const suggestions = [
        ...new Set([
          ...items.map((item) => item.name),
          ...items.map((item) => item.category),
          ...items.map((item) => item.supplierName),
          ...items
            .flatMap((item) => item.description?.split(" ") || [])
            .filter((word) => word.length > 3),
        ]),
      ].slice(0, 20);
      setSearchSuggestions(suggestions);
    }
  }, [items]);

  // Debounced search
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        fetchMarketplaceItems();
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      fetchMarketplaceItems();
    }
  }, [searchTerm, selectedCategory, advancedFilters]);

  const fetchMarketplaceItems = async () => {
    setLoading(true);
    try {
      // Use the new marketplace-specific endpoint
      const url = new URL("http://localhost:5000/api/inventory/marketplace");

      // Add filters if any
      if (searchTerm) {
        url.searchParams.append("search", searchTerm);
      }
      if (selectedCategory) {
        url.searchParams.append("category", selectedCategory);
      }

      // Add advanced filters
      if (advancedFilters.priceRange.min) {
        url.searchParams.append("minPrice", advancedFilters.priceRange.min);
      }
      if (advancedFilters.priceRange.max) {
        url.searchParams.append("maxPrice", advancedFilters.priceRange.max);
      }
      if (advancedFilters.suppliers.length > 0) {
        url.searchParams.append(
          "suppliers",
          advancedFilters.suppliers.join(",")
        );
      }
      if (advancedFilters.availability) {
        url.searchParams.append("availability", advancedFilters.availability);
      }
      if (advancedFilters.sortBy) {
        url.searchParams.append("sortBy", advancedFilters.sortBy);
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        console.log(
          `🛒 Loaded ${data.length} marketplace items from suppliers`
        );
      } else {
        console.error(
          "Failed to fetch marketplace items:",
          response.statusText
        );
        toast.error("Failed to load marketplace items");
      }
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
      toast.error("Error connecting to marketplace");
    } finally {
      setLoading(false);
    }
  };

  // Refresh items when search or category changes
  useEffect(() => {
    fetchMarketplaceItems();
  }, [searchTerm, selectedCategory]);

  const addToCart = (item, quantity) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        vendorId: user.uid,
        vendorName: userProfile?.businessName || user.displayName,
        items: cart.map((item) => ({
          itemId: item.id,
          itemName: item.name,
          supplierId: item.supplierId,
          supplierName: item.supplierName,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
        })),
        totalAmount: parseFloat(calculateTotal()),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success("Order placed successfully! 🎉");
        setCart([]);
        setShowCart(false);
        fetchMarketplaceItems(); // Refresh items to update quantities
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(items.map((item) => item.category))];
  const suppliers = [...new Set(items.map((item) => item.supplierName))];

  // Advanced filter configuration
  const filterConfig = [
    {
      key: "priceRange",
      label: "Price Range (₹)",
      type: "range",
    },
    {
      key: "suppliers",
      label: "Suppliers",
      type: "multiselect",
      options: suppliers.map((supplier) => ({
        value: supplier,
        label: supplier,
      })),
    },
    {
      key: "availability",
      label: "Availability",
      type: "select",
      options: [
        { value: "in-stock", label: "In Stock" },
        { value: "low-stock", label: "Low Stock" },
        { value: "out-of-stock", label: "Out of Stock" },
      ],
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select",
      options: [
        { value: "name-asc", label: "Name (A-Z)" },
        { value: "name-desc", label: "Name (Z-A)" },
        { value: "price-asc", label: "Price (Low to High)" },
        { value: "price-desc", label: "Price (High to Low)" },
        { value: "quantity-desc", label: "Most Available" },
      ],
    },
  ];

  const handleAdvancedFilterChange = (key, value) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      priceRange: { min: "", max: "" },
      suppliers: [],
      availability: "",
      sortBy: "",
      location: "",
    });
  };

  // Analytics data
  const getAnalyticsData = () => {
    const categoryData = categories.map((category) => ({
      label: category,
      value: items.filter((item) => item.category === category).length,
    }));

    const supplierData = suppliers.slice(0, 5).map((supplier) => ({
      label: supplier,
      value: items.filter((item) => item.supplierName === supplier).length,
    }));

    const priceDistribution = [
      {
        label: "₹0-100",
        value: items.filter((item) => item.price <= 100).length,
      },
      {
        label: "₹101-500",
        value: items.filter((item) => item.price > 100 && item.price <= 500)
          .length,
      },
      {
        label: "₹501-1000",
        value: items.filter((item) => item.price > 500 && item.price <= 1000)
          .length,
      },
      {
        label: "₹1000+",
        value: items.filter((item) => item.price > 1000).length,
      },
    ];

    return { categoryData, supplierData, priceDistribution };
  };

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
              🛒 Marketplace
            </h1>
            <p className="text-gray-600">
              Discover fresh products from trusted suppliers
            </p>
          </div>

          <Button
            onClick={() => setShowCart(true)}
            variant="primary"
            size="lg"
            className="relative shadow-primary"
            icon={<span>🛒</span>}
          >
            Cart ({cart.length})
            {cart.length > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-2 -right-2 animate-pulse"
              >
                {cart.length}
              </Badge>
            )}
          </Button>

          <Button
            onClick={() => setShowAnalytics(!showAnalytics)}
            variant="secondary"
            size="lg"
            className="shadow-secondary"
            icon={<span>📊</span>}
          >
            Analytics
          </Button>
        </motion.div>

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" className="shadow-medium">
              <Card.Header>
                <Card.Title>📊 Marketplace Analytics</Card.Title>
                <Card.Description>
                  Insights and trends from the marketplace data
                </Card.Description>
              </Card.Header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard
                  title="Products by Category"
                  type="bar"
                  data={getAnalyticsData().categoryData}
                  height="200px"
                />
                <ChartCard
                  title="Top Suppliers"
                  type="pie"
                  data={getAnalyticsData().supplierData}
                  height="200px"
                />
                <ChartCard
                  title="Price Distribution"
                  type="line"
                  data={getAnalyticsData().priceDistribution}
                  height="200px"
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Market Rates */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient" className="hover-lift">
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title className="flex items-center text-primary-700">
                  <span className="mr-2 text-2xl">📈</span>
                  Today's Market Rates (Delhi NCR)
                </Card.Title>
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary-600 hover:text-primary-700"
                >
                  View All Rates →
                </Button>
              </div>
            </Card.Header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Rice (Basmati)",
                  price: "₹4,200-4,800/q",
                  change: "+2.5% ↗",
                  trend: "up",
                },
                {
                  name: "Wheat",
                  price: "₹2,100-2,300/q",
                  change: "+1.2% ↗",
                  trend: "up",
                },
                {
                  name: "Onion",
                  price: "₹1,800-2,200/q",
                  change: "-3.4% ↘",
                  trend: "down",
                },
                {
                  name: "Tomato",
                  price: "₹2,500-3,000/q",
                  change: "+15.2% ↗",
                  trend: "up",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  className="bg-white rounded-xl p-4 shadow-soft border border-white/50"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      item.trend === "up"
                        ? "text-success-600"
                        : "text-error-600"
                    }`}
                  >
                    {item.price}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      item.trend === "up"
                        ? "text-success-600"
                        : "text-error-600"
                    }`}
                  >
                    {item.change}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated" className="shadow-medium">
            <Card.Header>
              <div className="flex justify-between items-center">
                <div>
                  <Card.Title>🔍 Search & Filter Products</Card.Title>
                  <Card.Description>
                    Find the perfect products from our marketplace
                  </Card.Description>
                </div>
                <AdvancedFilter
                  filters={filterConfig}
                  activeFilters={advancedFilters}
                  onFilterChange={handleAdvancedFilterChange}
                  onClearAll={clearAdvancedFilters}
                />
              </div>
            </Card.Header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SearchWithSuggestions
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, suppliers, categories..."
                suggestions={searchSuggestions}
                loading={isSearching}
                icon={<span>🔍</span>}
                onSuggestionSelect={(suggestion) => setSearchTerm(suggestion)}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm ||
              selectedCategory ||
              Object.values(advancedFilters).some((v) =>
                Array.isArray(v)
                  ? v.length > 0
                  : v !== "" &&
                    v !== null &&
                    (typeof v !== "object" ||
                      Object.values(v).some((val) => val !== ""))
              )) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Active Filters:
                  </span>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      clearAdvancedFilters();
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-error-600"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge
                      variant="primary"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    >
                      Search: "{searchTerm}" ✕
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory("")}
                    >
                      Category: {selectedCategory} ✕
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or check back later for new
                products.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ProductCard item={item} onAddToCart={addToCart} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Cart Modal */}
        {showCart && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-strong"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card padding="none">
                <Card.Header>
                  <div className="flex justify-between items-center">
                    <Card.Title className="flex items-center">
                      <span className="mr-2">🛒</span>
                      Shopping Cart
                    </Card.Title>
                    <Button
                      onClick={() => setShowCart(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </div>
                </Card.Header>

                {cart.length === 0 ? (
                  <Card.Content>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="text-gray-500 text-lg">
                        Your cart is empty
                      </p>
                      <p className="text-gray-400 text-sm">
                        Add some products to get started!
                      </p>
                    </div>
                  </Card.Content>
                ) : (
                  <>
                    <Card.Content>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <motion.div
                            key={item.id}
                            className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm text-primary-600 font-medium">
                                ₹{item.price}/{item.unit}
                              </p>
                              <p className="text-sm text-gray-500">
                                By: {item.supplierName}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity - 1)
                                }
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                              >
                                -
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                onClick={() =>
                                  updateCartQuantity(item.id, item.quantity + 1)
                                }
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                              >
                                +
                              </Button>
                              <Button
                                onClick={() => removeFromCart(item.id)}
                                variant="ghost"
                                size="sm"
                                className="text-error-600 hover:text-error-700 ml-2"
                              >
                                Remove
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card.Content>

                    <Card.Footer>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xl font-bold">
                          <span>Total:</span>
                          <span className="text-primary-600">
                            ₹{calculateTotal()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={placeOrder}
                            disabled={loading}
                            loading={loading}
                            variant="success"
                            size="lg"
                            className="shadow-primary"
                          >
                            Place Order
                          </Button>
                          <Button
                            onClick={() => setShowCart(false)}
                            variant="outline"
                            size="lg"
                          >
                            Continue Shopping
                          </Button>
                        </div>
                      </div>
                    </Card.Footer>
                  </>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Analytics Dashboard */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card variant="elevated" className="shadow-medium">
            <Card.Header>
              <Card.Title>📊 Marketplace Insights</Card.Title>
              <Card.Description>
                Comprehensive analytics and trends from the marketplace
              </Card.Description>
            </Card.Header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <ChartCard
                title="Product Categories"
                description="Distribution of products by category"
                type="pie"
                data={analyticsData.categoryDistribution}
                colors={[
                  "#059669",
                  "#2563eb",
                  "#ea580c",
                  "#7c3aed",
                  "#dc2626",
                  "#0891b2",
                ]}
              />

              {/* Price Trends */}
              <ChartCard
                title="Price Trends"
                description="Average prices by category over time"
                type="line"
                data={analyticsData.priceTrends}
                colors={["#059669", "#2563eb"]}
              />

              {/* Monthly Sales */}
              <ChartCard
                title="Monthly Performance"
                description="Sales activity over the last 6 months"
                type="bar"
                data={analyticsData.monthlySales}
                colors={["#059669"]}
              />

              {/* Supplier Performance */}
              <ChartCard
                title="Top Suppliers"
                description="Most active suppliers in the marketplace"
                type="bar"
                data={analyticsData.supplierPerformance}
                colors={["#2563eb"]}
              />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  {analyticsData.totalProducts}
                </div>
                <div className="text-sm opacity-90">Total Products</div>
              </div>
              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  {analyticsData.totalSuppliers}
                </div>
                <div className="text-sm opacity-90">Active Suppliers</div>
              </div>
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  ${analyticsData.avgPrice}
                </div>
                <div className="text-sm opacity-90">Average Price</div>
              </div>
              <div className="bg-gradient-to-br from-success-500 to-success-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">
                  {analyticsData.trendingCategories.length}
                </div>
                <div className="text-sm opacity-90">Trending Categories</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProductCard({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(item.minOrder || 1);
  const [showReviews, setShowReviews] = useState(false);

  const handleAddToCart = () => {
    if (quantity >= (item.minOrder || 1) && quantity <= item.quantity) {
      onAddToCart(item, quantity);
      toast.success(
        `Added ${quantity} ${item.unit} of ${item.name} to cart! 🛒`
      );
    }
  };

  return (
    <Card className="hover-lift h-full">
      <Card.Header>
        <div className="flex justify-between items-start">
          <div>
            <Card.Title className="text-lg">{item.name}</Card.Title>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
          <Badge variant="success" size="sm">
            Available
          </Badge>
        </div>
      </Card.Header>

      <Card.Content>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-primary-600">
              ₹{item.price}/{item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Available:</span>
            <span className="font-medium">
              {item.quantity} {item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Min Order:</span>
            <span className="font-medium">
              {item.minOrder} {item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Supplier:</span>
            <div className="flex flex-col items-end">
              <span className="font-medium text-secondary-600">
                {item.supplierName}
              </span>
              <button
                onClick={() => setShowReviews(true)}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1"
              >
                View Reviews & Ratings
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <input
            type="number"
            min={item.minOrder || 1}
            max={item.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <span className="text-sm text-gray-600">{item.unit}</span>
        </div>
      </Card.Content>

      <Card.Footer>
        <Button
          onClick={handleAddToCart}
          disabled={quantity < (item.minOrder || 1) || quantity > item.quantity}
          variant={
            quantity >= (item.minOrder || 1) && quantity <= item.quantity
              ? "primary"
              : "ghost"
          }
          fullWidth
          className="shadow-primary"
        >
          Add to Cart
        </Button>
      </Card.Footer>

      {/* Supplier Reviews Modal */}
      {showReviews && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Reviews for {item.supplierName}
              </h3>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <SupplierReview
                supplierId={item.supplierId || item.id}
                supplierName={item.supplierName}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </Card>
  );
}

export default VendorMarketplace;

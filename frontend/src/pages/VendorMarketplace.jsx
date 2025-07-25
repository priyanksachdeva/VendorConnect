import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function VendorMarketplace() {
  const { user, userProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/inventory");
      if (response.ok) {
        const data = await response.json();
        setItems(data.filter((item) => item.quantity > 0)); // Only show available items
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

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
        alert("Order placed successfully!");
        setCart([]);
        setShowCart(false);
        fetchMarketplaceItems(); // Refresh items to update quantities
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">🛒 Marketplace</h2>
        <button
          onClick={() => setShowCart(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center relative"
        >
          <span className="mr-2">🛒</span>
          Cart ({cart.length})
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Quick Market Rates */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📈</span>
            Today's Market Rates (Delhi NCR)
          </h3>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Rates →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="font-medium text-gray-900">Rice (Basmati)</div>
            <div className="text-green-600 font-semibold">₹4,200-4,800/q</div>
            <div className="text-xs text-green-600">+2.5% ↗</div>
          </div>
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="font-medium text-gray-900">Wheat</div>
            <div className="text-green-600 font-semibold">₹2,100-2,300/q</div>
            <div className="text-xs text-green-600">+1.2% ↗</div>
          </div>
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="font-medium text-gray-900">Onion</div>
            <div className="text-red-600 font-semibold">₹1,800-2,200/q</div>
            <div className="text-xs text-red-600">-3.4% ↘</div>
          </div>
          <div className="bg-white rounded-md p-3 shadow-sm">
            <div className="font-medium text-gray-900">Tomato</div>
            <div className="text-green-600 font-semibold">₹2,500-3,000/q</div>
            <div className="text-xs text-green-600">+15.2% ↗</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ProductCard key={item.id} item={item} onAddToCart={addToCart} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No products found matching your criteria.</p>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Shopping Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.price}/{item.unit}
                        </p>
                        <p className="text-sm text-gray-500">
                          By: {item.supplierName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                      Total: ₹{calculateTotal()}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={placeOrder}
                      disabled={loading}
                      className={`flex-1 py-2 px-4 rounded-md text-white ${
                        loading
                          ? "bg-gray-400"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {loading ? "Placing Order..." : "Place Order"}
                    </button>
                    <button
                      onClick={() => setShowCart(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(item.minOrder || 1);

  const handleAddToCart = () => {
    if (quantity >= (item.minOrder || 1) && quantity <= item.quantity) {
      onAddToCart(item, quantity);
      alert(`Added ${quantity} ${item.unit} of ${item.name} to cart!`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            Available
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium text-green-600">
              ₹{item.price}/{item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Available:</span>
            <span>
              {item.quantity} {item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Min Order:</span>
            <span>
              {item.minOrder} {item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Supplier:</span>
            <span className="font-medium">{item.supplierName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <label className="text-sm text-gray-600">Quantity:</label>
          <input
            type="number"
            min={item.minOrder || 1}
            max={item.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span className="text-sm text-gray-600">{item.unit}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={quantity < (item.minOrder || 1) || quantity > item.quantity}
          className={`w-full py-2 px-4 rounded-md text-white ${
            quantity >= (item.minOrder || 1) && quantity <= item.quantity
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default VendorMarketplace;

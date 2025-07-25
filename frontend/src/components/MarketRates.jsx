import { useState, useEffect } from "react";

function MarketRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState("delhi");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Sample mandi data - in production you'd use a real API
  const sampleMandiRates = {
    delhi: [
      {
        commodity: "Rice (Basmati)",
        market: "Azadpur Mandi",
        price: "4200-4800",
        unit: "₹/quintal",
        change: "+2.5%",
      },
      {
        commodity: "Wheat",
        market: "Najafgarh Mandi",
        price: "2100-2300",
        unit: "₹/quintal",
        change: "+1.2%",
      },
      {
        commodity: "Onion",
        market: "Azadpur Mandi",
        price: "1800-2200",
        unit: "₹/quintal",
        change: "-3.4%",
      },
      {
        commodity: "Potato",
        market: "Azadpur Mandi",
        price: "1200-1600",
        unit: "₹/quintal",
        change: "+0.8%",
      },
      {
        commodity: "Tomato",
        market: "Azadpur Mandi",
        price: "2500-3000",
        unit: "₹/quintal",
        change: "+15.2%",
      },
      {
        commodity: "Ginger",
        market: "Azadpur Mandi",
        price: "8000-12000",
        unit: "₹/quintal",
        change: "+5.6%",
      },
      {
        commodity: "Garlic",
        market: "Azadpur Mandi",
        price: "15000-18000",
        unit: "₹/quintal",
        change: "-2.1%",
      },
      {
        commodity: "Green Chilli",
        market: "Azadpur Mandi",
        price: "3000-4500",
        unit: "₹/quintal",
        change: "+8.3%",
      },
    ],
    punjab: [
      {
        commodity: "Rice (Basmati)",
        market: "Sangrur Mandi",
        price: "4100-4700",
        unit: "₹/quintal",
        change: "+1.8%",
      },
      {
        commodity: "Wheat",
        market: "Ludhiana Mandi",
        price: "2050-2250",
        unit: "₹/quintal",
        change: "+0.9%",
      },
      {
        commodity: "Maize",
        market: "Bathinda Mandi",
        price: "1800-2000",
        unit: "₹/quintal",
        change: "+2.1%",
      },
      {
        commodity: "Cotton",
        market: "Fazilka Mandi",
        price: "5800-6200",
        unit: "₹/quintal",
        change: "+3.2%",
      },
    ],
    maharashtra: [
      {
        commodity: "Onion",
        market: "Lasalgaon Mandi",
        price: "1600-2000",
        unit: "₹/quintal",
        change: "-4.2%",
      },
      {
        commodity: "Sugarcane",
        market: "Kolhapur Mandi",
        price: "280-320",
        unit: "₹/quintal",
        change: "+1.5%",
      },
      {
        commodity: "Soybean",
        market: "Indore Mandi",
        price: "3800-4200",
        unit: "₹/quintal",
        change: "+2.8%",
      },
      {
        commodity: "Cotton",
        market: "Akola Mandi",
        price: "5600-6000",
        unit: "₹/quintal",
        change: "+1.9%",
      },
    ],
  };

  const states = [
    { value: "delhi", label: "Delhi NCR" },
    { value: "punjab", label: "Punjab" },
    { value: "maharashtra", label: "Maharashtra" },
  ];

  useEffect(() => {
    fetchMarketRates();
  }, [selectedState]);

  const fetchMarketRates = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, you would call a real mandi rates API like:
      // const response = await fetch(`https://api.data.gov.in/resource/mandi-rates?state=${selectedState}`);
      // const data = await response.json();

      const data = sampleMandiRates[selectedState] || [];
      setRates(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching market rates:", error);
      setError("Failed to fetch market rates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchMarketRates();
  };

  const getPriceChangeColor = (change) => {
    if (change.startsWith("+")) return "text-green-600";
    if (change.startsWith("-")) return "text-red-600";
    return "text-gray-600";
  };

  const getPriceChangeBg = (change) => {
    if (change.startsWith("+")) return "bg-green-100";
    if (change.startsWith("-")) return "bg-red-100";
    return "bg-gray-100";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            📈 Live Mandi Rates
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time wholesale market prices across India
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>{loading ? "Updating..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading market rates...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commodity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rates.map((rate, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {rate.commodity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{rate.market}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {rate.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{rate.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriceChangeBg(
                          rate.change
                        )} ${getPriceChangeColor(rate.change)}`}
                      >
                        {rate.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && rates.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">
            No market rates available for the selected state.
          </p>
        </div>
      )}

      {/* Market insights */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Market Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-800">
              <strong>Price Trends:</strong> Tomato prices are showing
              significant increase due to monsoon effects.
            </p>
          </div>
          <div>
            <p className="text-blue-800">
              <strong>Best Time to Buy:</strong> Early morning arrivals
              typically offer better rates.
            </p>
          </div>
          <div>
            <p className="text-blue-800">
              <strong>Storage Tip:</strong> Consider bulk purchasing for
              non-perishable items during price dips.
            </p>
          </div>
          <div>
            <p className="text-blue-800">
              <strong>Quality Check:</strong> Higher prices often indicate
              better quality and longer shelf life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketRates;

import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

const MandiPrices = () => {
  const [mandiData, setMandiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState("");

  useEffect(() => {
    fetchMandiPrices();
  }, [selectedCommodity]);

  const fetchMandiPrices = async () => {
    try {
      const url = selectedCommodity
        ? `${API_BASE_URL}/mandi?commodity=${selectedCommodity}`
        : `${API_BASE_URL}/mandi`;

      const response = await axios.get(url);
      setMandiData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mandi prices:", error);
      setLoading(false);
    }
  };

  const commodities = ["Tomato", "Onion", "Potato", "Rice", "Wheat"];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Live Mandi Prices
        </h3>

        <select
          value={selectedCommodity}
          onChange={(e) => setSelectedCommodity(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Commodities</option>
          {commodities.map((commodity) => (
            <option key={commodity} value={commodity}>
              {commodity}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mandiData.slice(0, 6).map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{item.commodity}</h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {item.market}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Min Price:</span>
                <span className="font-medium text-green-600">
                  ₹{item.minPrice}/{item.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Max Price:</span>
                <span className="font-medium text-red-600">
                  ₹{item.maxPrice}/{item.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Modal Price:</span>
                <span className="font-medium text-blue-600">
                  ₹{item.modalPrice}/{item.unit}
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Updated: {new Date(item.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Data source: Agmarknet • Updated in real-time
      </div>
    </div>
  );
};

export default MandiPrices;

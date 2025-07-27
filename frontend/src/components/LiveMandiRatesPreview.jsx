import { useState, useEffect } from "react";
import axios from "axios";

function LiveMandiRatesPreview() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("http://localhost:5000/mandi")
      .then((res) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setRates(res.data.data.slice(0, 4));
        } else {
          // fallback to /api/mandi if /mandi returns no data
          axios
            .get("http://localhost:5000/api/mandi")
            .then((res2) => {
              setRates(res2.data.data.slice(0, 4));
              setLoading(false);
            })
            .catch(() => setLoading(false));
          return;
        }
        setLoading(false);
      })
      .catch(() => {
        // fallback to /api/mandi if /mandi fails
        axios
          .get("http://localhost:5000/api/mandi")
          .then((res2) => {
            setRates(res2.data.data.slice(0, 4));
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, []);
  if (loading) return <div className="p-4 text-gray-500">Loading rates...</div>;
  if (!rates || rates.length === 0)
    return <div className="p-4 text-gray-500">No mandi rates available.</div>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {rates.map((item, idx) => (
        <div
          key={item.commodity}
          className="bg-white rounded-xl p-4 shadow-soft border border-white/50"
        >
          <div className="font-semibold text-gray-900 text-sm">
            {item.commodity}
          </div>
          <div className="font-bold text-lg text-primary-700">
            ₹{item.minPrice}-{item.maxPrice}/{item.unit}
          </div>
          <div className="text-xs text-gray-600">{item.market}</div>
          <div className="text-xs text-gray-500">Modal: ₹{item.modalPrice}</div>
        </div>
      ))}
    </div>
  );
}

export default LiveMandiRatesPreview;

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const SuppliersMap = ({ suppliers, userLocation }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    initializeMap();
  }, [userLocation]);

  useEffect(() => {
    if (map) {
      updateMarkers();
    }
  }, [suppliers, map]);

  const initializeMap = async () => {
    // For hackathon demo, we'll create a simulated map
    // In production, you would use the actual Google Maps API
    const mapContainer = mapRef.current;

    if (!mapContainer) return;

    // Create a simple map simulation
    mapContainer.innerHTML = `
      <div class="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
        <div class="text-center z-10">
          <div class="mb-4">
            <svg class="w-12 h-12 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3v10.5m6-10.5v10.5"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Google Maps Integration</h3>
          <p class="text-sm text-gray-600 mt-1">Interactive map with supplier locations</p>
          <p class="text-xs text-gray-500 mt-2">Demo Mode - Add Google Maps API key to enable</p>
        </div>
        
        <!-- Simulated map pins -->
        <div class="absolute inset-0 opacity-20">
          ${suppliers
            .map(
              (supplier, index) => `
            <div class="absolute bg-red-500 rounded-full w-3 h-3 border-2 border-white shadow-lg" 
                 style="top: ${30 + ((index * 15) % 40)}%; left: ${
                20 + ((index * 20) % 60)
              }%;">
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    // Add supplier list below the map
    const suppliersList = document.createElement("div");
    suppliersList.className = "mt-4 space-y-2";
    suppliersList.innerHTML = `
      <h4 class="font-medium text-gray-900 mb-3">Suppliers on Map (${
        suppliers.length
      })</h4>
      ${suppliers
        .map(
          (supplier, index) => `
        <div class="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <div>
              <div class="font-medium text-sm">${supplier.name}</div>
              <div class="text-xs text-gray-600">${supplier.location}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-900">₹${supplier.minOrder}+</div>
            <div class="text-xs text-gray-600">${supplier.category}</div>
          </div>
        </div>
      `
        )
        .join("")}
    `;

    mapContainer.parentNode.appendChild(suppliersList);
  };

  const updateMarkers = () => {
    // In a real implementation, this would update Google Maps markers
    console.log("Updating markers for", suppliers.length, "suppliers");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Suppliers Map View
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>
            Your location:{" "}
            {userLocation
              ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`
              : "Unknown"}
          </span>
        </div>
      </div>

      <div ref={mapRef} className="w-full">
        {/* Map will be rendered here */}
      </div>
    </div>
  );
};

export default SuppliersMap;

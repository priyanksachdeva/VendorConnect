import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Suppliers API
export const supplierAPI = {
  getAll: (params = {}) => api.get("/suppliers", { params }),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post("/suppliers", data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
  getCategories: () => api.get("/suppliers/meta/categories"),
};

// Inventory API
export const inventoryAPI = {
  getAll: (params = {}) => api.get("/inventory", { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post("/inventory", data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  updateQuantity: (id, quantity, reason) =>
    api.patch(`/inventory/${id}/quantity`, { quantity, reason }),
  delete: (id) => api.delete(`/inventory/${id}`),
  getStats: () => api.get("/inventory/stats"),
  getLowStock: () => api.get("/inventory/alerts/low-stock"),
};

// Orders API
export const orderAPI = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Community API
export const communityAPI = {
  getAll: () => api.get("/community"),
  getById: (id) => api.get(`/community/${id}`),
  create: (data) => api.post("/community", data),
  update: (id, data) => api.put(`/community/${id}`, data),
  delete: (id) => api.delete(`/community/${id}`),
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      // Handle authentication errors
      console.error("Authentication failed");
    }
    return Promise.reject(error);
  }
);

export default api;

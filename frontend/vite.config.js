import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API requests to the backend server
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Proxy auth requests to the backend
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      // Proxy suppliers requests to the backend API
      "/suppliers": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
      },
    },
  },
});

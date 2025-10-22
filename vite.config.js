import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // 👈 quan trọng
    proxy: {
      // Proxy cho Goong Maps API để tránh CORS
      '/api/goong': {
        target: 'https://rsapi.goong.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/goong/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  define: {
    global: "window", // ✅ Fix lỗi "global is not defined"
  },
});

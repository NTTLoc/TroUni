import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // 👈 quan trọng
  },
  define: {
    global: "window", // ✅ Fix lỗi "global is not defined"
  },
});

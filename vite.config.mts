import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/charts": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});

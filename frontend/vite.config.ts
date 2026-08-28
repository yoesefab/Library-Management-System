import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    outDir: "dist/client",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/@radix-ui/")) return "radix-ui";
          if (id.includes("/node_modules/@tanstack/")) return "query";
          if (
            id.includes("/node_modules/recharts/") ||
            id.includes("/node_modules/d3-")
          )
            return "charts";
          if (
            id.includes("/node_modules/react-router") ||
            id.includes("/node_modules/react-dom/") ||
            id.endsWith("/node_modules/react/index.js")
          )
            return "react-vendor";
          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": decodeURIComponent(new URL("./src", import.meta.url).pathname),
    },
  },
  optimizeDeps: { include: ["react", "react-dom/client"] },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    proxy: { "/api": "http://127.0.0.1:8080" },
    warmup: { clientFiles: ["./src/main.tsx"] },
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    fileParallelism: false,
    exclude: ["tests/**", "e2e/**", "node_modules/**", "dist/**"],
  },
});

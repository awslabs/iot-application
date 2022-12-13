/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./tests/unit/setup.js",
    exclude: ["**/e2e/**", "**/node_modules/**"],
    coverage: {
      exclude: ["**/index.ts"],
    },
  },
});

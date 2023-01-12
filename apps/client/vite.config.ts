/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  test: {
    environment: "happy-dom",
    setupFiles: "./test/setup.js",
  },
  plugins: [react()],
});

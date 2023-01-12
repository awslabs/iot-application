/// <reference types="vitest" />
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  server: {
    port: 3000,
  },
  test: {
    environment: "node",
    globals: true,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "nest",
      appPath: "./src/main.ts",
      exportName: "coreViteApp",
      tsCompiler: "swc",
    }),
  ],
  optimizeDeps: {
    /**
     * Vite does not like optional dependencies. If these lines are
     * removed, the dev script will fail.
     */
    exclude: [
      "@nestjs/microservices",
      "@nestjs/platform-express",
      "@fastify/static",
      "@fastify/view",
      "@nestjs/websockets",
      "cache-manager",
      "class-transformer",
      "class-validator",
      "fastify-swagger",
    ],
  },
});

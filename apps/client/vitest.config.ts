import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
  ],
  test: {
    alias: {
      '~': '/src',
    },
    environment: 'jsdom',
    globals: true,
    includeSource: ['src/**/*.{js,ts}'],
    setupFiles: './src/test/setup.ts',
  },
  define: {
    // enable removal from production code
    'import.meta.vitest': false,
  },
});

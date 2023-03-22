import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    includeSource: ['src/**/*.{js,ts}'],
  },
  define: {
    // enable removal from production code
    'import.meta.vitest': false,
  },
});

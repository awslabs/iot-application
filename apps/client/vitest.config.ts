import { defineConfig, coverageConfigDefaults } from 'vitest/config';
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
    coverage: {
      all: true,
      exclude: [
        ...coverageConfigDefaults.exclude,
        'node_modules/**/*',
        'config-overrides.js',
        'build/**/*',
        'html/**/*',
        'lang/**/*',
        'public/**/*',
        'src/services/generated/**/*',
        'src/types/**/*',
      ],
      reporter: ['text', 'html'],
      /**
       * Application was initially tested with Playwright, covering core
       * client functionality. We now plan to backfill unit tests and reach
       * the coverage levels defined in the watermarks below.
       *
       * Please increase the coverage levels as you add tests.
       */
      statements: 46,
      branches: 66,
      functions: 35,
      lines: 46,
      watermarks: {
        statements: [80, 95],
        branches: [80, 95],
        functions: [80, 95],
        lines: [80, 95],
      },
    },
    environment: 'jsdom',
    globals: true,
    includeSource: ['src/**/*.{js,ts}'],
    reporters: ['verbose', 'html'],
    setupFiles: './src/test/setup.ts',
    singleThread: true,
  },
  define: {
    // enable removal from production code
    'import.meta.vitest': false,
  },
});

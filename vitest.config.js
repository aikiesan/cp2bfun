import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Files measured for coverage (relative to the config file at repo root)
      include: ['cp2b_web/src/**/*.{js,jsx}'],
      exclude: [
        'node_modules/',
        'cp2b_web/src/test/',
        '**/*.config.{js,ts}',
        '**/dist/',
        // Admin pages are complex and tested incrementally — excluded from
        // threshold enforcement while the suite is still growing.
        'cp2b_web/src/pages/admin/**',
        'cp2b_web/src/components/admin/**',
        // Entry point has no testable logic
        'cp2b_web/src/main.jsx',
      ],
      // Minimum coverage gates enforced by `npm run test:coverage`.
      // Raise these numbers progressively as you write more tests.
      thresholds: {
        statements: 40,
        branches: 35,
        functions: 40,
        lines: 40,
      },
    },
  },
});

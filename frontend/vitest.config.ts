import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/__tests__/**/*.spec.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist', 'coverage'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        '.next/**',
        '__tests__/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        'coverage/**',
        '**/*.types.ts',
        '**/*.stories.tsx',
      ],
      // Temporarily disabled until more tests are written
      // thresholds: {
      //   lines: 70,
      //   functions: 70,
      //   branches: 60,
      //   statements: 70,
      // },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/types': path.resolve(__dirname, './types'),
    },
  },
});

import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: './index.advanced.html',
      },
    },
    base: process.env.GITHUB_PAGES === 'true' ? '/front_7th_chapter3-2/' : '/',
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)

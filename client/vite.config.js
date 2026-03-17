import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/ (Triggering fresh build)
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  }
});

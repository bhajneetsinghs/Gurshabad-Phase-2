// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/banidb': {
        target: 'https://api.banidb.com', // ← base domain only, NO /v2 here
        changeOrigin: true,
        secure: true,
        // /api/banidb/angs/347  →  /v2/angs/347
        rewrite: (path) => path.replace(/^\/api\/banidb/, '/v2'),
      },
    },
  },
});
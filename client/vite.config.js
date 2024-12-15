import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    loader: 'jsx',
  },
  assetsInclude: ['**/*.JPG'],
  publicDir: 'public',
  
  // define: {
  //   'process.env': {
  //     VITE_API_URL: JSON.stringify(env.VITE_API_URL),
  //     NODE_ENV: JSON.stringify(env.NODE_ENV),
  //     COOKIE_DOMAIN: JSON.stringify(env.COOKIE_DOMAIN)
  //   }
  // }

  server: {
    host: process.env.VITE_COOKIE_DOMAIN,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': {
      NODE_ENV: process.env.VITE_NODE_ENV,
      API_URL: process.env.VITE_API_URL,
    }
  }
});

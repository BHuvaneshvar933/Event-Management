import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
import path from "path";

export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  }
});

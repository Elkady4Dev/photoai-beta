import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Ensure CSS files keep .css extension
          if (assetInfo.name?.endsWith('.css')) {
            return `assets/[name].[hash].css`;
          }
          // JS files
          if (assetInfo.name?.endsWith('.js')) {
            return `assets/[name].[hash].js`;
          }
          // Other assets
          return `assets/[name].[hash][extname]`;
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  preview: {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type',
      'Access-Control-Allow-Credentials': 'true'
    }
  }
}));

import { resolve } from 'path'
import path from 'path';
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@js': path.resolve(__dirname, './src/js'),
      '@scss': path.resolve(__dirname, './src/scss'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  css: { 
    preprocessorOptions: { 
      scss: { 
        additionalData: `
          @import "./src/scss/framework/_vars/_vars.scss";
          @import "./src/scss/framework/_mixins/_mixins.scss";
          @import "./src/scss/framework/foundation/foundation.scss";
        ` 
      }  
    }
  }  
})
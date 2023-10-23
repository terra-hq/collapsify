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
        // about: resolve(root, 'about.html'), 
        // pagewithfolder: resolve(root, 'folder', 'about.html'), 
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
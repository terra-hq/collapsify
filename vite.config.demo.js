import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: resolve(__dirname, 'src'),
    publicDir: 'public',
    build: {
        outDir: resolve(__dirname, 'demo'),
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@js': resolve(__dirname, './src/js'),
            '@scss': resolve(__dirname, './src/scss'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "./src/scss/framework/_vars/_vars.scss";
                    @import "./src/scss/framework/_mixins/_mixins.scss";
                    @import "./src/scss/framework/foundation/foundation.scss";
                `,
            },
        },
    },
});

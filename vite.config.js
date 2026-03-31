import { defineConfig } from 'vite';
import { resolve } from 'path';

const entryPath = resolve(__dirname, 'src/js/core/Collapsify.js');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
    build: {
        lib: {
            entry: entryPath,
            name: 'Collapsify',
            formats: ['es', 'umd'],
            fileName: (format) => `Collapsify.${format}.js`,
        },
        outDir,
        emptyOutDir: true,
        rollupOptions: {
            external: ['@andresclua/jsutil', '@terrahq/helpers'],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@js': resolve(__dirname, './src/js'),
            '@scss': resolve(__dirname, './src/scss'),
        },
    },
});

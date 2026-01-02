import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: '/dbdevtools-www/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        remixtree: resolve(__dirname, 'remixtree.html')
      }
    }
  }
});

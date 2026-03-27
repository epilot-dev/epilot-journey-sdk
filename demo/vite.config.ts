import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/journey-sdk-playground/',
  plugins: [react()],
  resolve: {
    alias: {
      '@epilot/epilot-journey-sdk': path.resolve(__dirname, '../src/index.ts'),
      '@epilot/journey-client': path.resolve(__dirname, '../node_modules/@epilot/journey-client')
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },  
});

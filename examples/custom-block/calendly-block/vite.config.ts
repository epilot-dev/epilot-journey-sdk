import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // making sure no assets are hashed
      output: {
        entryFileNames: () => {
          // the rest goes into /assets folder
          return 'assets/[name].js'
        },
        chunkFileNames: 'chunks/[name].js'
      }
    }
  }
})

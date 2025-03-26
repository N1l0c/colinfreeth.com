import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lorenz-synth': path.resolve(__dirname, 'lorenz-synth/src'),
    },
  },
  optimizeDeps: {
    exclude: ['lorenz-synth'],
  },
  build: {
    outDir: 'dist',
  },
})

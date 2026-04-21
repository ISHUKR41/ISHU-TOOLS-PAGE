import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    minify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    // Ensure CSS is extracted as a separate file linked in HTML — loads in parallel
    // with JS so styles are available before React hydrates.
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-router')
          ) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          // ── Tool field definitions (201KB source / ~151KB minified) ──
          // Only needed on /tools/:slug pages, never on homepage.
          if (id.includes('features/tool/toolFields')) {
            return 'tool-fields'
          }
          if (id.includes('node_modules/')) {
            return 'vendor-misc'
          }
        },
      },
      // ── NOTE: treeshake removed — `moduleSideEffects: false` was incorrectly
      // treating CSS @import side-effects as dead code in some Rollup versions.
      // Rollup's default treeshake is safe and still eliminates dead JS code.
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
    ],
    exclude: [],
  },
})

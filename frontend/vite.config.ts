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
          // ── Three.js + R3F: ONLY needed for game/3D tools, isolate to its own chunk ──
          if (
            id.includes('node_modules/three/') ||
            id.includes('node_modules/@react-three/')
          ) {
            return 'vendor-three'
          }
          // ── GSAP: heavy animation lib — own chunk so it doesn't block first paint ──
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap'
          }
          // ── Axios + dropzone + file-saver: only needed on tool execution pages ──
          if (
            id.includes('node_modules/axios') ||
            id.includes('node_modules/react-dropzone') ||
            id.includes('node_modules/file-saver')
          ) {
            return 'vendor-tool-runtime'
          }
          // ── SEO data (7.5K-line file, ~140KB) — only needed on /tools/:slug ──
          if (id.includes('lib/seoData')) {
            return 'seo-data'
          }
          // ── Tool field definitions (201KB source / ~151KB minified) ──
          // Only needed on /tools/:slug pages, never on homepage.
          if (id.includes('features/tool/toolFields')) {
            return 'tool-fields'
          }
          // ── Catalog fallback (offline tool list, ~480KB) — used by
          //    HomePage AND ToolPage. Splitting it out gives both pages a
          //    cacheable shared chunk and stops it from inflating the
          //    HomePage entry. ────────────────────────────────────────────
          if (id.includes('data/catalogFallback')) {
            return 'catalog-fallback'
          }
          // ── Site shell + nav mega-menu — large hard-coded link list
          //    shared across every route. Naming it explicitly keeps the
          //    build report readable (was previously named after the first
          //    file Rollup happened to encounter). ──────────────────────
          if (
            id.includes('components/layout/SiteShell') ||
            id.includes('components/layout/AnimatedBackdrop')
          ) {
            return 'site-shell'
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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
    }),
    // Bundle size analyzer - generates stats.html
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  // Build optimizations
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',

    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js'],
        },
        // Optimize chunk names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Source maps for production debugging (disable for smaller bundle)
    sourcemap: false,

    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,

    // Report compressed size
    reportCompressedSize: true,
  },

  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
    cors: true,
    // HMR configuration
    hmr: {
      overlay: true,
    },
  },

  // Preview server configuration
  preview: {
    port: 8080,
    strictPort: false,
    host: true,
    open: true,
  },

  // Optimization settings
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['web-vitals'],
  },

  // CSS optimization
  css: {
    devSourcemap: false,
    postcss: './postcss.config.js',
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
    },
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  // Compression
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})

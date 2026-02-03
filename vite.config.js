import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // JSX runtime optimization
      jsxRuntime: 'automatic',
    }),
    // Gzip compression
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files larger than 10kb
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
    // Brotli compression (better than gzip)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    // Bundle size analyzer - generates stats.html
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // Use treemap for better visualization
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
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 3, // More aggressive optimization
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
      },
      mangle: {
        safari10: true,
        toplevel: true,
      },
      format: {
        comments: false,
        ecma: 2015,
      },
      module: true,
    },

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks with more granular splitting
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('chart.js')) {
              return 'chart-vendor'
            }
            // All other vendor code
            return 'vendor'
          }
        },
        // Optimize chunk names with content hash for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const name = facadeModuleId.split('/').pop().replace('.jsx', '')
            return `assets/js/${name}-[hash].js`
          }
          return 'assets/js/[name]-[hash].js'
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/img/[name]-[hash].[ext]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].[ext]`
          }
          return `assets/[ext]/[name]-[hash].[ext]`
        },
      },
      // Tree-shaking optimization
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
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

    // Inline small assets as base64
    assetsInlineLimit: 4096, // 4kb

    // Preload modules
    modulePreload: {
      polyfill: true,
    },
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

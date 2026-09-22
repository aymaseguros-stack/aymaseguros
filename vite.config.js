import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = dirname(fileURLToPath(import.meta.url))

// En producción la reescritura la hace vercel.json; en `vite dev` y
// `vite preview`, este middleware: /emision/:token -> /emision.html.
const rutaEmision = {
  name: 'ayma-ruta-emision',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (/^\/emision\/[^/?#]+\/?(\?.*)?$/.test(req.url || '')) req.url = '/emision.html'
      next()
    })
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (/^\/emision\/[^/?#]+\/?(\?.*)?$/.test(req.url || '')) req.url = '/emision.html'
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), rutaEmision],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        // H-36: drop_console borraba también los console.error, y con ellos
        // todo rastro de un lead que no se pudo registrar. Se sacan solo los
        // console de ruido; error y warn quedan visibles en producción.
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        drop_debugger: true
      }
    },
    rollupOptions: {
      // C-6b: /emision/:token es una entrada propia, SIN los scripts de
      // terceros (GTM, Meta Pixel, Trustpilot) que index.html carga en todas
      // las rutas: la URL lleva el token. vercel.json la reescribe.
      input: {
        main: resolve(raiz, 'index.html'),
        emision: resolve(raiz, 'emision.html'),
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.js',
        'dist/'
      ]
    }
  }
})

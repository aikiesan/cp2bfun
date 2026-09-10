import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.claude/**',
        '**/backend/**',
        '**/public/assets/**',
      ],
    },
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Separa só as bibliotecas compartilhadas por site público e admin,
        // para que uma troca de código nosso não invalide o cache delas.
        // Devolver undefined nos outros casos é intencional: deixa o Rollup
        // decidir, e é o que mantém quill/dnd/image-compression dentro do
        // chunk sob demanda do admin (ver src/AdminApp.jsx). Agrupar todo o
        // node_modules em um "vendor" desfaria esse split.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) {
            return 'react-vendor';
          }
          if (/[\\/]node_modules[\\/](bootstrap|react-bootstrap|@restart)[\\/]/.test(id)) {
            return 'bootstrap-vendor';
          }
          if (/[\\/]node_modules[\\/]framer-motion[\\/]/.test(id)) {
            return 'motion';
          }
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // O registro vive em src/registerServiceWorker.js, que recarrega a
      // página quando o service worker novo assume. O registerSW.js que o
      // plugin injetava só registrava, e não tinha hash no nome — a regra
      // `immutable` do Apache o congelaria por um ano.
      injectRegister: null,
      manifest: {
        name: 'CP2b - Centro Paulista de Estudos em Biogas e Bioprodutos',
        short_name: 'CP2b',
        description: 'Centro Paulista de Estudos em Biogas e Bioprodutos - UNICAMP',
        theme_color: '#1E3E4C',
        background_color: '#f8f9fa',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/assets/logos/cp2b-avatar-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/assets/logos/cp2b-avatar-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globIgnores: [
          '**/assets/logos/cp2b-logo-og.png',
          // O chunk do admin (~600 KB) é carregado sob demanda em /admin.
          // Sem isso o workbox o pré-cachearia em todo visitante do site
          // público, desfazendo metade do ganho do split.
          '**/assets/AdminApp-*.js',
          '**/assets/AdminApp-*.css',
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/pilar2b/],
        cleanupOutdatedCaches: true,
        // Imagens ficam fora do precache: os logos da marca em @8x somavam
        // ~10 MB, baixados em segundo plano por todo visitante que instalava
        // o service worker. Elas continuam cacheadas, mas sob demanda, pela
        // regra de runtimeCaching de imagens abaixo.
        globPatterns: ['**/*.{js,css,html,ico,woff,woff2,otf}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'flag-icons',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /\.(?:jpg|jpeg|webp|gif|png|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                // Um dia. As fotos não têm hash no nome, então trocar a foto
                // de alguém mantendo o arquivo não apareceria antes disso.
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5,
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.js'],
    css: true,
    testTimeout: 15000,
    hookTimeout: 15000,
    // Playwright specs live in e2e/; backend tests use node:test (run them
    // with `npm test` inside backend/). Neither can run under Vitest/jsdom.
    exclude: [...configDefaults.exclude, 'e2e/**', 'backend/**'],
    coverage: {
      provider: 'v8',
    },
  },
})

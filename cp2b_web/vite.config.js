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
        // Tudo que não é o shell sai para assets/pages/, e é essa pasta que o
        // workbox deixa de pré-cachear (ver globIgnores adiante). Sem a
        // separação por pasta o service worker baixaria, em toda primeira
        // visita, as ~30 páginas que o React.lazy acabou de tirar do caminho
        // crítico — o ganho do split valeria só para o primeiro paint.
        //
        // O shell é o que qualquer rota precisa: o chunk de entrada e os três
        // vendors abaixo (o framer-motion entra porque o SocialSidebar, que
        // fica fora do <Routes>, o usa).
        chunkFileNames(chunk) {
          const shell = chunk.isEntry
            || ['react-vendor', 'bootstrap-vendor', 'motion'].includes(chunk.name);
          return shell ? 'assets/[name]-[hash].js' : 'assets/pages/[name]-[hash].js';
        },
        // O CSS de uma página sob demanda acompanha o JS dela: o Vite emite um
        // arquivo por chunk com CSS próprio (AdminApp, ForumPaulista,
        // Indicators, Research, Governance). Sem mandá-los para a mesma pasta,
        // ficariam no precache sozinhos — o do admin sozinho já são 21 KB que
        // nenhum visitante do site público usa.
        //
        // Só o CSS é redirecionado. As fontes e imagens vivem em public/ e são
        // copiadas sem passar por aqui; qualquer outro asset segue o padrão.
        assetFileNames(asset) {
          const source = asset.names?.[0] ?? asset.name ?? '';
          if (source.endsWith('.css')) {
            const base = source.slice(0, -'.css'.length);
            if (!['index', 'bootstrap-vendor', 'react-vendor', 'motion'].includes(base)) {
              return 'assets/pages/[name]-[hash][extname]';
            }
          }
          return 'assets/[name]-[hash][extname]';
        },
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
          // Chunks sob demanda: uma página por arquivo, mais o painel admin
          // (~600 KB). Pré-cacheá-los somava ~2 MB baixados em segundo plano
          // por todo visitante, inclusive quem lia uma notícia e ia embora.
          // Continuam cacheados, mas só depois de visitados, pela regra de
          // runtimeCaching abaixo. Ver build.rollupOptions.chunkFileNames.
          '**/assets/pages/**',
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/pilar2b/, /^\/arqueia/],
        cleanupOutdatedCaches: true,
        // Imagens ficam fora do precache: os logos da marca em @8x somavam
        // ~10 MB, baixados em segundo plano por todo visitante que instalava
        // o service worker. Elas continuam cacheadas, mas sob demanda, pela
        // regra de runtimeCaching de imagens abaixo.
        // Entre os formatos de fonte, só woff2 entra no precache. Os .otf da
        // marca (styles/fonts.css) e o .woff dos bootstrap-icons são fallback
        // do woff2 que está ao lado deles: juntos somavam ~1,1 MB pré-baixados
        // para servir navegadores que não existem mais no acesso real. Os
        // arquivos continuam publicados — quem precisar deles os busca na rede.
        globPatterns: ['**/*.{js,css,html,ico,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            // Os chunks de página que saíram do precache. O nome carrega o
            // hash do conteúdo, então o arquivo nunca muda sob a mesma URL e
            // CacheFirst é seguro: quem já visitou a página abre offline e
            // sem rede na próxima vez, e quem não visitou não paga por ela.
            urlPattern: /\/assets\/pages\/.*\.(?:js|css)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'page-chunks',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
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

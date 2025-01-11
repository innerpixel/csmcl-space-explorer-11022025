import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'CSMCL Space Explorer',
        short_name: 'CSMCL Space',
        description: 'Explore and manage your CSMCL space',
        theme_color: '#4a90e2',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'static/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'static/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'static/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
})

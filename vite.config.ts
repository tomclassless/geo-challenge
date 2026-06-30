import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' lets the built app work both at a domain root and in a
// GitHub Pages sub-path (https://user.github.io/repo/) without changes.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192.png', 'pwa-512.png', 'pwa-maskable-512.png'],
      manifest: {
        name: '地理大挑戰',
        short_name: '地理挑戰',
        description: '暑假地理題庫輪流作答',
        lang: 'zh-Hant',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'landscape',
        background_color: '#F5A524',
        theme_color: '#F5A524',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Precache the app shell + any media committed under public/ so the
        // game opens and plays fully offline once installed at home.
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,mp4,webp,woff2}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // Remote (URL-based) images get cached on first online view.
            urlPattern: ({ request }) =>
              request.destination === 'image' || request.destination === 'video',
            handler: 'CacheFirst',
            options: {
              cacheName: 'media',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 90 }
            }
          }
        ]
      }
    })
  ]
})

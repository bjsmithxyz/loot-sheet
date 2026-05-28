import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon.svg'],
            manifest: {
                name: 'Loot Sheet',
                short_name: 'Loot Sheet',
                description: 'TBC Classic loot tracking for loot councils',
                theme_color: '#0a0a0c',
                background_color: '#0a0a0c',
                display: 'standalone',
                start_url: '/loot-sheet/',
                scope: '/loot-sheet/',
                icons: [
                    {
                        src: 'icon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                    {
                        src: 'icon.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                navigateFallback: '/loot-sheet/index.html',
                globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/wow\.zamimg\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'wow-icons',
                            expiration: {
                                maxEntries: 256,
                                maxAgeSeconds: 60 * 60 * 24 * 30,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
        }),
    ],
    base: '/loot-sheet/',
})

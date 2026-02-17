import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Inspector from 'unplugin-vue-dev-locator/vite'
import traeBadgePlugin from 'vite-plugin-trae-solo-badge'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // ⚠️ 关键：设为相对路径，否则 iOS 添加到主屏幕后白屏
  base: './',

  plugins: [
    vue(),
    Inspector(),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#app',
    }),
    // ✅ 新增 PWA 插件
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false, // 开发环境不启用 PWA
      },
      manifest: {
        name: '咖啡点单', // ← 替换为你自己的 App 名称
        short_name: 'Coffee', // ← 短名称（主屏幕显示）
        description: '您的专属咖啡店点单应用',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // 全屏，无浏览器 UI
        orientation: 'portrait',
        scope: './',
        start_url: './',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/trae-api-sg\.mchost\.guru\/.*\.(png|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 缓存 7 天
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ 定义 @ = src
    },
  },
})
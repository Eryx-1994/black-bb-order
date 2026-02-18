import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  base: './', // ← 关键修复

  plugins: [
    vue(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sử dụng PostCSS để xử lý Tailwind v4 (theo thông báo lỗi)
export default defineConfig({
  plugins: [react()],
  base: '/mycv/',
})

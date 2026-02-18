import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  // สำคัญ: ต้องตรงกับชื่อ Repository บน GitHub
  base: '/mockup-case-manage-list/', 
})
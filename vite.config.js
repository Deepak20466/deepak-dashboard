import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: "/deepak-dashboard",
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    // FORCE VITE TO IGNORE THESE DURING OPTIMIZATION
    exclude: [
      "@fullcalendar/react",
      "@fullcalendar/core",
      "@fullcalendar/daygrid",
      "@fullcalendar/timegrid",
      "@fullcalendar/interaction",
      "@fullcalendar/list"
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 3000,
  },
})
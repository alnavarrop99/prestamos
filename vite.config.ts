import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import legacy from '@vitejs/plugin-legacy'
import progress from 'vite-plugin-progress'
import svgr from 'vite-plugin-svgr'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import alias from './vite.alias'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias,
  },
  plugins: [react(), legacy({}), progress(), svgr(), TanStackRouterVite()],
})

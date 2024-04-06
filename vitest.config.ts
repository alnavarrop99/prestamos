import { defineConfig } from 'vitest/config'
import alias from './vite.alias'

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test.setup.ts'],
  },
})

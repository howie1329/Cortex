import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer')
    }
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/renderer/test/setup.ts']
  }
})

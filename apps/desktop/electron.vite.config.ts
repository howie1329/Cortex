import { resolve } from 'node:path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer')
      }
    },
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: './routes',
        generatedRouteTree: './routeTree.gen.ts'
      }),
      react()
    ]
  }
})

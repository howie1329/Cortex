import { contextBridge } from 'electron'
import type { CortexApi, CortexPlatform } from '../shared/cortex-api'

const supportedPlatforms = new Set<CortexPlatform>(['darwin', 'linux', 'win32'])

if (!supportedPlatforms.has(process.platform as CortexPlatform)) {
  throw new Error(`Unsupported Cortex platform: ${process.platform}`)
}

const cortexApi = {
  platform: process.platform as CortexPlatform
} satisfies CortexApi

if (!process.contextIsolated) {
  throw new Error('Cortex requires Electron context isolation')
}

contextBridge.exposeInMainWorld('cortex', cortexApi)

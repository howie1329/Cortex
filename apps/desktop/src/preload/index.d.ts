import type { CortexApi } from '../shared/cortex-api'

declare global {
  interface Window {
    cortex: CortexApi
  }
}

export {}

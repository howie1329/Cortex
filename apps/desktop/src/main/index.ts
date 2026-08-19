import { app, BrowserWindow, shell } from 'electron'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'

const APP_ID = 'com.howie.cortex'

function isAllowedExternalUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

function createWindow(): void {
  const rendererFile = join(__dirname, '../renderer/index.html')
  const rendererUrl = process.env.ELECTRON_RENDERER_URL

  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  window.once('ready-to-show', () => {
    window.show()
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalUrl(url)) {
      void shell.openExternal(url)
    }

    return { action: 'deny' }
  })

  window.webContents.on('will-navigate', (event, url) => {
    const target = new URL(url)

    if (is.dev && rendererUrl && target.origin === new URL(rendererUrl).origin) {
      return
    }

    target.hash = ''
    target.search = ''
    if (target.href === pathToFileURL(rendererFile).href) {
      return
    }

    event.preventDefault()
  })

  if (is.dev && rendererUrl) {
    void window.loadURL(rendererUrl)
  } else {
    void window.loadFile(rendererFile)
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId(APP_ID)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

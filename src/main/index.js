'use strict'

import {app, Menu, ipcMain, BrowserWindow, screen, Tray, dialog} from 'electron'
import path from 'path'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let childWindow
let tray = null

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

app.on('ready', () => {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize
  createMainWindow(width - 300, height - 100)
  registerIPC()
  registerTray()
})
app.on('quit', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})

const registerIPC = function() {
  ipcMain.on('min', event => mainWindow.minimize())
  ipcMain.on('max', event => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.on('pin', event => {
    if (mainWindow.isAlwaysOnTop()) {
      mainWindow.setAlwaysOnTop(false)
    } else {
      mainWindow.setAlwaysOnTop(true)
    }
  })
  ipcMain.on('close', event => mainWindow.close())
  ipcMain.on('createWebWindow', (e, url, title) => {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize
    createWebWindow(width - 400, height - 200, url, title)
  })
  ipcMain.on('openDirectoryDialog', event => {
    dialog.showOpenDialog({
      defaultPath: app.getPath('pictures'),
      properties: [
        'openDirectory'
      ]
    }, (directoryPath) => {
      if (directoryPath) {
        event.sender.send('selectedDirectory', directoryPath)
      }
    })
  })
}

const registerTray = function() {
  const trayIcon = path.join(__dirname, '/resource/icon.ico')
  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出应用',
      click: () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
      }
    }
  ])
  tray.setToolTip('相机先生 Mr.Camera')
  tray.setContextMenu(contextMenu)
}

function createMainWindow(width = 980, height = 680) {
  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 980,
    minHeight: 680,
    resizable: true,
    useContentSize: true,
    frame: false,
    // transparent: true,
    // backgroundColor: '#4e8cfe',
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true // node version above 5 requirement
    }
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}

function createWebWindow(width = 980, height = 680, url, title = 'Mr Camera') {
  Menu.setApplicationMenu(null)
  childWindow = new BrowserWindow({
    width,
    height,
    title,
    minWidth: 980,
    minHeight: 680,
    resizable: true,
    useContentSize: true,
    frame: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true // node version above 5 requirement
    }
  })
  childWindow.loadURL(url)
  childWindow.on('closed', () => {
    childWindow = null
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

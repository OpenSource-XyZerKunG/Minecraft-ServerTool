const {app, BrowserWindow, Menu, ipcMain, remote} = require('electron')
const { link } = require('fs')
const ipc = ipcMain
const path = require('path')
const url = require('url')

// Windows
let index

function createwindows() {
    index = new BrowserWindow({
        'title': "ServerTool",
        'icon': path.join(__dirname, "img/terminal.png"),
        'frame': false,
        'webPreferences': {
            'nodeIntegration': true,
            'contextIsolation': false
        },
        'minWidth': 800,
        'minHeight': 480
    })
    //index.openDevTools()
    Menu.setApplicationMenu(new Menu())
    index.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: 'file:',
        slashes: true
    }))
    ipc.on('*e^Q$xV?z>6[$X@9', () => {
        index.minimize()
    })
    ipc.on('A%Q3,BUNbw6Sxjtw', () => {
        if (!index.isMaximized()) {
            index.maximize()
        }else {
            index.unmaximize()
        }
    })
    ipc.on('X=E[8}N&L;j6nN}9', () => {
        index.close()
    })
}

app.on('ready', createwindows)

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})
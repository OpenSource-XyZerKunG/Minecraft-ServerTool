const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const ipc = ipcRenderer
const { link } = require('fs')
const path = require('path')
const url = require('url')

// Windows
let index

let type = "unknown"

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
    Menu.setApplicationMenu(new Menu())
    index.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: 'file:',
        slashes: true
    }))
    ipcMain.on('async-message', (event, arg) => {
        console.log(arg)
        switch (arg) {
            case "*e^Q$xV?z>6[$X@9":
                index.minimize()
                break
            case "A%Q3,BUNbw6Sxjtw":
                if (!index.isMaximized()) {
                    index.maximize()
                }else {
                    index.unmaximize()
                }
                break
            case "X=E[8}N&L;j6nN}9":
                index.close()
                break
            case "snapshot":
                type = 'snapshot'
                pageSetup()
                break
            case "bukkit":
                type = 'bukkit'
                pageSetup()
                break
            case "paper":
                type = 'paper'
                pageSetup()
                break
            case "origin":
                type = 'origin'
                pageSetup()
                break
            case "Ready! ? setup":
                ipc.sendSync("async-message", "id0:" + type)
                break
            case "index":
                pageSetup()
                break
            default:
                console.log("Unknown Message: " + arg)
                break
        }
    })
}

function pageSetup() {
    index.loadURL(url.format({
        pathname: path.join(__dirname, "setup.html"),
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', createwindows)

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})
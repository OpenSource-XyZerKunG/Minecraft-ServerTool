const {app, BrowserWindow, Menu, ipcMain, ipcRenderer} = require('electron')
const ipc = ipcRenderer
const { link } = require('fs')
const path = require('path')
const url = require('url')

let ui

function createwindows() {
    ui = new BrowserWindow({
        'title': "ServerTool",
        'icon': path.join(__dirname, "img/terminal.png"),
        'frame': false,
        'webPreferences': {
            'nodeIntegration': true,
            'contextIsolation': false
        },
        'minWidth': 800,
        'minHeight': 480,
        'show': false
    })
    ui.once('ready-to-show', () => {
        ui.show()
    })
    ui.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: 'file:',
        slashes: true
    }))
    Menu.setApplicationMenu(new Menu())
    ipcMain.on('async-message', (event, arg) => {
        switch (arg) {
            case "*e^Q$xV?z>6[$X@9":
                ui.minimize()
                break
            case "A%Q3,BUNbw6Sxjtw":
                if (!ui.isMaximized()) {
                    ui.maximize()
                }else {
                    ui.unmaximize()
                }
                break
            case "X=E[8}N&L;j6nN}9":
                ui.close()
                break
            default:
                console.log("Unknown Message: " + arg)
                break
        }
    })
}

app.on('ready', createwindows)

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})
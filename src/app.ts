import {app, BrowserWindow, Menu} from "electron"
const path = require("path")
const url = require("url")
const vars = require("./var")
let ui:any = null

const http = require("http").createServer()
const socket = require("socket.io")(http)

// Create Socket
function createsocket() {
    socket.on("connection", (client:any):any => {
        if (client.handshake.address != "::ffff:127.0.0.1") {
            client.destroy
        }else {
            console.log("UI Connect!")
            client.on("post:app", (message:any):any => {
                switch (message) {
                    case "get:type":
                        client.emit("post:type", String(vars.type))
                        break
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
                }
            })
            client.on("post:type", (message:any):any => {
                vars.type = String(message)
                console.log("TYPE: " + vars.type)
            })
            client.on("post:data", (message:any):any => {
                let data = String(message).split(",")
                vars.title = data[0]
                vars.folder = data[1]
                vars.version = data[2]
                console.log("Console Title: " + vars.title)
                console.log("Folder Name: " + vars.folder)
                console.log("Version: " + vars.version)
            })
        }
    })
    
    http.listen(45785, () => {
        console.log("Wait for UI..")
    })
}

// Create Window
function createWindow():any {
    createsocket()
    ui = new BrowserWindow({
        "title": "ServerTool",
        "icon": path.join(__dirname, "img/terminal.png"),
        "frame": false,
        "webPreferences": {
            "nodeIntegration": true,
            "contextIsolation": false
        },
        "minWidth": 800,
        "minHeight": 480,
        "show": false
    })
    ui.once("ready-to-show", ():any => {
        ui.show()
        ui.webContents.openDevTools()
    })
    ui.loadURL(url.format({
        "pathname": path.join(__dirname, "select.html"),
        "protocol": "file:",
        "slashes": true
    }))
    Menu.setApplicationMenu(new Menu())
}

// When App Ready
app.on("ready", createWindow)

// When Window Close
app.on("window-all-closed", ():any => {
    if (process.platform != "darwin") {
        app.quit()
    }
})
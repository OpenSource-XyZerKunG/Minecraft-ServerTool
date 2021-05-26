import {app, BrowserWindow, Menu, ipcMain, dialog} from "electron"
import Axios from "axios"
import path from "path"
import url from "url"
import file from "fs"
const pty = require("node-pty")
const vars = require("./var")
let ui:any = null
const shell = process.platform == "win32" ? "powershell.exe" : "bash"
const ptyProcess = pty.spawn(shell, [], {
    "name": "xterm-color",
    "cols": 80,
    "rows": 30,
    "cwd": app.getPath("desktop"),
    "env": process.env
})

// Create Socket
function createsocket() {
    ipcMain.on("post:app", (event:any, message:any):any => {
        switch (message) {
            case "spigottool":
                const toolfile = file.createWriteStream(path.join(vars.path, vars.folder, "spigottool.jar")) 
                const functionaxios = async () => {
                    const res = await Axios({
                        url: "https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar",
                        method: 'GET',
                        responseType: 'stream'
                    })
                    const totalBytes = res.headers["content-length"]
                    let receivedBytes = 0
                    res.data.on("data", (chunk:any):any => {
                        receivedBytes += chunk.length
                        event.reply("statustool", Math.floor((receivedBytes / totalBytes) * 100))
                    })
                    res.data.pipe(toolfile)
                }
                functionaxios()
                break
            case "get:all":
                event.reply("post:all", vars.title + ":don'ttypethis:(:" + vars.folder + ":don'ttypethis:(:" + vars.envvar + ":don'ttypethis:(:" + vars.version + ":don'ttypethis:(:" + vars.nogui + ":don'ttypethis:(:" + vars.eula + ":don'ttypethis:(:" + vars.autorun + ":don'ttypethis:(:" + vars.type + ":don'ttypethis:(:" + vars.path)
                break
            case "get:type":
                event.reply("post:type", String(vars.type))
                break
            case "get:desktop":
                event.reply("post:desktop", app.getPath("desktop"))
                break
            case "get:choosebox":
                dialog.showOpenDialog(ui, {
                    "defaultPath": app.getPath("desktop"),
                    "properties": ["openDirectory", "createDirectory"]
                }).then((data) => {
                    event.reply("post:choosebox",  data.canceled + ":" + data.filePaths)
                })
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
    ipcMain.on("post:type", (event:any, message:any):any => {
        vars.type = String(message)
        console.log("TYPE: " + vars.type)
    })
    ipcMain.on("post:data", (event:any, message:any):any => {
        let data = String(message).split(":don'ttypethis:(:")
        vars.title = data[0]
        vars.folder = data[1]
        vars.envvar = data[2]
        vars.version = data[3]
        vars.nogui = data[4]
        vars.eula = data[5]
        vars.autorun = data[6]
        vars.path = data[7]
        console.log("Console Title: " + vars.title)
        console.log("Folder Name: " + vars.folder)
        console.log("Environment Variable: " + vars.envvar)
        console.log("Version: " + vars.version)
        console.log("NoGUI: " + vars.nogui)
        console.log("Eula: " + vars.eula)
        console.log("AutoRun: " + vars.autorun)
        console.log("Dir: " + vars.path)
    })

    ptyProcess.on("data", (data:any) => {
        ui.webContents.send("terminal.incomingData", data)
    })

    ipcMain.on("terminal.keystroke", (event, key) => {
        ptyProcess.write(key)
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
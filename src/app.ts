import {app, BrowserWindow, Menu} from "electron"
import Axios from "axios"
import path from "path"
import url from "url"
import file from "fs"
const vars = require("./var")
let ui:any = null

const http = require("http").createServer()
const socket = require("socket.io")(http)

// For Build Function
let ___dirname = __dirname

if (__dirname.endsWith("\\resources\\app.asar\\build")) {
    ___dirname = __dirname.replace("\\resources\\app.asar\\build", "")
}

// Create Socket
function createsocket() {
    socket.on("connection", (client:any):any => {
        if (client.handshake.address != "::ffff:127.0.0.1") {
            client.destroy
        }else {
            console.log("UI Connect!")
            client.on("post:app", (message:any):any => {
                switch (message) {
                    case "spigottool":
                        const toolfile = file.createWriteStream(path.join(___dirname, vars.folder, "spigottool.jar")) 
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
                                client.emit("statustool", Math.floor((receivedBytes / totalBytes) * 100))
                            })
                            res.data.pipe(toolfile)
                        }
                        functionaxios()
                        break
                    case "get:all":
                        client.emit("post:all", vars.title + ":don'ttypethis:(:" + vars.folder + ":don'ttypethis:(:" + vars.envvar + ":don'ttypethis:(:" + vars.version + ":don'ttypethis:(:" + vars.nogui + ":don'ttypethis:(:" + vars.eula + ":don'ttypethis:(:" + vars.autorun + ":don'ttypethis:(:" + vars.type)
                        break
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
                let data = String(message).split(":don'ttypethis:(:")
                vars.title = data[0]
                vars.folder = data[1]
                vars.envvar = data[2]
                vars.version = data[3]
                vars.nogui = data[4]
                vars.eula = data[5]
                vars.autorun = data[6]
                console.log("Console Title: " + vars.title)
                console.log("Folder Name: " + vars.folder)
                console.log("Environment Variable: " + vars.envvar)
                console.log("Version: " + vars.version)
                console.log("NoGUI: " + vars.nogui)
                console.log("Eula: " + vars.eula)
                console.log("AutoRun: " + vars.autorun)
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
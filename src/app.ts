const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = require("electron")
import Axios from "axios"
import Ngrok from "ngrok"
import path from "path"
import url from "url"
import file from "fs"
import controllerPIPE from "./pipe/controller"
import * as constDBPIPE from "./pipe/constantDB"
import * as ipcChannelPIPE from "./pipe/ipcChannel"
import { GET, GETCOLLECTION, STORE } from "./pipe/tempDB"
//import { terminalChannel, newInstanceParameter } from "./pipe/terminal"
import { ngrokChannel, startParameters, killParameters } from "./pipe/ngrok"

const constantDatabase = {}
const temporaryDatabase = {}
const indexTemp = {}

type buildtoolMessage = {
    "path": string,
    "folder": string
}

function createIPC(ui) {
    ipcMain.handle(ipcChannelPIPE.MAIN.TEMPDB_GET, (event, get: GET) => {
        return temporaryDatabase[get.path]
    })

    ipcMain.handle(ipcChannelPIPE.MAIN.TEMPDB_COLLECTION, (event, collection: GETCOLLECTION) => {
        const indexArray = indexTemp[collection.path] as Array<string>
        const returnTemp = {}

        if (!indexArray) return returnTemp

        indexArray.forEach((findMatch) => {
            const linkName = `${collection.path}.${findMatch}`
            const fromTEMP = temporaryDatabase[linkName]

            if (fromTEMP) {
                returnTemp[linkName] = fromTEMP
            } else {
                returnTemp[linkName] = ""
            }
        })

        return returnTemp
    })

    ipcMain.on(ipcChannelPIPE.MAIN.TEMPDB_STORE, (event, store: STORE) => {
        const indexPath = store.path.split(".")
        const indexName = indexPath.slice(0, indexPath.length - 1).join(".")
        const indexValue: Array<string> | undefined = indexTemp[indexName]
        const storeData = indexPath[indexPath.length - 1]
        
        if (Array.isArray(indexValue)) {
            if (!indexValue.includes(storeData)) indexValue.push(storeData)
        } else {
            indexTemp[indexName] = [ storeData ]
        }

        temporaryDatabase[store.path] = store.data
    })

    ipcMain.handle(constDBPIPE.CONSTDB.CHANNEL, (event, data: constDBPIPE.GETCONST) => {
        return constantDatabase[data.path]
    })

    ipcMain.on(ipcChannelPIPE.MAIN.DOWNLOAD_BUILDTOOL, async (event, buildtool: buildtoolMessage) => {
        const res = await Axios({
            url: "https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar",
            method: "GET",
            responseType: "stream"
        })

        const toolfile = file.createWriteStream(path.join(buildtool.path, "spigottool.jar"))

        const totalBytes = res.headers["content-length"]
        let receivedBytes = 0
        res.data.on("data", (chunk) => {
            receivedBytes += chunk.length
            event.reply(ipcChannelPIPE.RENDERER.RETURN_BUILDTOOL, Math.floor((receivedBytes / totalBytes) * 100))
        })

        res.data.pipe(toolfile)
    })

    ipcMain.on(ipcChannelPIPE.MAIN.CONTROLLER_APP, (event, controller: controllerPIPE) => {
        switch (controller) {
            case controllerPIPE.MINIMIZE:
                if (!ui.isMaximized()) {
                    ui.maximize()
                } else {
                    ui.unmaximize()
                }
                break
            case controllerPIPE.FULLSCREEN:
                ui.minimize()
                break
            case controllerPIPE.CLOSE:
                ui.close()
                break
        }
    })

    ipcMain.on(ipcChannelPIPE.MAIN.NEW_CHOOSEBOX, (event, ignore) => {
        dialog.showOpenDialog(ui, {
            "defaultPath": app.getPath("desktop"),
            "properties": ["openDirectory", "createDirectory"]
        }).then((data) => {
            if (!data.canceled) {
                event.reply(ipcChannelPIPE.RENDERER.RETURN_CHOOSEBOX, data.filePaths)
            }
        })
    })

    ipcMain.handle(ngrokChannel.START, async (event, parameters: startParameters) => {
        const url = await Ngrok.connect({
            "authtoken": parameters.authtoken,
            "proto": parameters.proto,
            "addr": parameters.addr,
            "region": parameters.region
        })

        constantDatabase[constDBPIPE.CONSTDB.NGROKLIST].push(url)
        return url
    })

    ipcMain.on(ngrokChannel.KILL, async (event, parameters: killParameters) => {
        await Ngrok.disconnect(String(parameters.url))
        constantDatabase[constDBPIPE.CONSTDB.NGROKLIST] = constantDatabase[constDBPIPE.CONSTDB.NGROKLIST].filter(tunnel => tunnel !== parameters.url)
    })
}

function declareConstDB() {
    constantDatabase[constDBPIPE.CONSTDB.DESKTOPPATH] = app.getPath("desktop")
    constantDatabase[constDBPIPE.CONSTDB.TERMINALLIST] = []
    constantDatabase[constDBPIPE.CONSTDB.NGROKLIST] = []
}

// Create Window
function createWindow() {
    app.allowRendererProcessReuse = false
    let ui = new BrowserWindow({
        "title": "ServerTool",
        "icon": path.join(__dirname, "img/terminal.png"),
        "frame": false,
        "webPreferences": {
            "nodeIntegration": true,
            "contextIsolation": false,
        },
        "center": true,
        "minWidth": 1024,
        "minHeight": 624,
        "fullscreenable": false,
        "transparent": true,
        "backgroundColor": "#222222",
        "show": false
    })

    declareConstDB()
    createIPC(ui)

    ui.once("ready-to-show", () => {
        ui.show()
        if (process.argv[2] === "--debug") {
            ui.webContents.openDevTools()
        }
    })

    ui.loadURL(url.format({
        "pathname": path.join(__dirname, "start.html"),
        "protocol": "file:",
        "slashes": true
    }))

    Menu.setApplicationMenu(new Menu())
}

// When App Ready
app.on("ready", createWindow)

// When Window Close
app.on("window-all-closed", () => {
    if (process.platform != "darwin") {
        app.quit()
    }
})
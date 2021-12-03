import api from "./api"
import * as ipcChannelPIPE from "../pipe/ipcChannel"
import * as constDBPIPE from "../pipe/constantDB"
import { GLOBAL } from "../pipe/tempDB"
import serverPIPE from "../pipe/servertype"

const versionlist = document.getElementById("versionlist") as HTMLSelectElement
const localpath = document.getElementById("localpath") as HTMLInputElement
const pathbutton = document.getElementById("pathbutton") as HTMLButtonElement
const done = document.getElementById("done") as HTMLButtonElement
const edit = document.getElementById("edit") as HTMLButtonElement
const URLMap: Map<string, string> = new Map()

edit && edit.addEventListener("click", () => {
    window.location.href = "select.html"
})

window.addEventListener("DOMContentLoaded", () => {
    global.ipcRenderer.send(constDBPIPE.CONSTDB.CHANNEL, {
        "path": constDBPIPE.CONSTDB.DESKTOPPATH,
        "returnChannel": constDBPIPE.GLOBALRETURN.DESKTOPPATH
    })

    global.ipcRenderer.on(constDBPIPE.GLOBALRETURN.DESKTOPPATH, (event, message) => {
        if (localpath) localpath.value = message
    })

    global.ipcRenderer.on(ipcChannelPIPE.RENDERER.RETURN_CHOOSEBOX, (event, message) => {
        if (localpath) localpath.value = message
    })

    pathbutton && pathbutton.addEventListener("click", () => {
        global.ipcRenderer.send(ipcChannelPIPE.MAIN.NEW_CHOOSEBOX)
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_GET, {
        "path": GLOBAL.SERVERTYPE,
        "returnChannel": GLOBAL.SERVERTYPE
    })

    global.ipcRenderer.on(GLOBAL.SERVERTYPE, async (event, message) => {
        const type = document.getElementById("type")
        if (type) type.innerText = "Type: " + String(message)

        if (message === serverPIPE.MOJANGRELEASE) {
            let manifest = await api.fetchMojangManifest("release")
            manifest.forEach((value) => {
                URLMap.set(value.id, value.url)
                const option = document.createElement("option")
                option.innerText = value.id
                versionlist && versionlist.appendChild(option)
            })
        } else if (message === serverPIPE.MOJANGSNAPSHOT) {
            let manifest = await api.fetchMojangManifest("snapshot")
            manifest.forEach((value) => {
                URLMap.set(value.id, value.url)
                const option = document.createElement("option")
                option.innerText = value.id
                versionlist && versionlist.appendChild(option)
            })
        } else if (message === serverPIPE.SPIGOTMC) {
            let manifest = await api.fetchSpigotManifest()
            manifest.forEach((value) => {
                const option = document.createElement("option")
                option.innerText = value
                versionlist && versionlist.appendChild(option)
            })
        } else if (message === serverPIPE.PAPERMC) {
            let manifest = await api.fetchPaperManifest()
            manifest.forEach((value) => {
                URLMap.set(value, `https://papermc.io/api/v1/paper/${value}/latest/download`)
                const option = document.createElement("option")
                option.innerText = value
                versionlist && versionlist.appendChild(option)
            })
        } else if (message === serverPIPE.PURPURMC) {
            let manifest = await api.fetchPurpurManifest()
            manifest.forEach((value) => {
                URLMap.set(value, `https://api.pl3x.net/v2/purpur/${value}/latest/download`)
                const option = document.createElement("option")
                option.innerText = value
                versionlist && versionlist.appendChild(option)
            })
        } else if (message === serverPIPE.AIRPLANE) {
            let manifest = await api.fetchAirplane()
            manifest.forEach((value) => {
                const URLValue = value.url
                URLMap.set(value.name, `${value.url}/lastSuccessfulBuild/artifact/target/launcher-${URLValue.length === 3 ? `${URLValue[0]}${URLValue[1]}`.toLowerCase() : URLValue[0].toLowerCase()}.jar`)
                const option = document.createElement("option")
                option.innerText = value.name.split("-").join(" ")
                versionlist && versionlist.appendChild(option)
            })
        }

        if (process.platform === "win32") {
            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = "css/terminal-windows.css"
            document.body.appendChild(link)
            
            const folderImage = document.getElementById("folderimage") as HTMLImageElement
            folderImage.src = "img/win-file.png"
        } else if (process.platform === "darwin") {
            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = "css/terminal-mac.css"
            document.body.appendChild(link)

            const folderImage = document.getElementById("folderimage") as HTMLImageElement
            folderImage.src = "img/mac-file.png"
        } else if (process.platform === "linux") {
            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = "css/terminal-linux.css"
            document.body.appendChild(link)
            
            const folderImage = document.getElementById("folderimage") as HTMLImageElement
            folderImage.src = "img/mac-file.png"
        }
    })
})

const consoletitle = document.getElementById("consoletitle") as HTMLInputElement
const foldername = document.getElementById("foldername") as HTMLInputElement
const termlabel = document.getElementById("terminaltext") as HTMLLabelElement
const folderlabel = document.getElementById("folderlabel") as HTMLLabelElement

consoletitle && consoletitle.addEventListener("input", () => {
    if (termlabel) termlabel.innerText = consoletitle.value
})

foldername && foldername.addEventListener("input", () => {
    if (folderlabel) folderlabel.innerText = foldername.value
})

done && done.addEventListener("click", () => {    
    const envVar = document.getElementById("envvar") as HTMLInputElement
    const nogui = document.getElementById("nogui") as HTMLInputElement
    const eula = document.getElementById("eula") as HTMLInputElement
    const autorun = document.getElementById("autorun") as HTMLInputElement

    const consolevalue = consoletitle.value
    const foldervalue = foldername.value

    if (!consolevalue && !foldervalue) {
        global.sweet2.fire({
            icon: "error",
            title: "Something Wrong",
            text: "Make sure you have entered the information",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        return
    }

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.CONSOLETITLE,
        "data": consoletitle.value
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.FOLDERNAME,
        "data": foldername.value
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.ENVVAR,
        "data": envVar.value
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.SERVERVERSION,
        "data": versionlist.value
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.SERVERURL,
        "data": URLMap.get(versionlist.value)
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.NOGUI,
        "data": nogui.checked
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.EULA,
        "data": eula.checked
    })

    global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
        "path": GLOBAL.LOCATION,
        "data": localpath.value
    })

    window.location.href = "final.html"
})

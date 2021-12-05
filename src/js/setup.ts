import api from "./api"
import * as ipcChannelPIPE from "../pipe/ipcChannel"
import * as constDBPIPE from "../pipe/constantDB"
import { GLOBAL } from "../pipe/tempDB"
import serverPIPE from "../pipe/servertype"
import Java from "../utils/java"

const versionlist = document.getElementById("versionlist") as HTMLSelectElement
const javalist = document.getElementById("javalist") as HTMLSelectElement
const javalabel = document.getElementById("java") as HTMLLabelElement
const localpath = document.getElementById("localpath") as HTMLInputElement
const pathbutton = document.getElementById("pathbutton") as HTMLButtonElement
const done = document.getElementById("done") as HTMLButtonElement
const edit = document.getElementById("edit") as HTMLButtonElement
const URLMap: Map<string, string> = new Map()

const java = new Java()

async function displayJava(type: serverPIPE, jlist: string[]) {
    let version: number | undefined = undefined

    switch (type) {
        case serverPIPE.MOJANGRELEASE:
        case serverPIPE.MOJANGSNAPSHOT:
            version = await api.detectJavaWithURL(URLMap.get(versionlist.value) as string)
            break
        case serverPIPE.SPIGOTMC:
        case serverPIPE.PAPERMC:
        case serverPIPE.PURPURMC:
        case serverPIPE.AIRPLANE:
            version = await api.detectJavaWithVersion(versionlist.value) || 8
            break
    }

    if (!version) version = 8

    const findJList = version <= 8 ? jlist.find((element) => element.split("_")[0].includes(String(version))) : jlist.find((element) => element.startsWith(String(version)))

    if (!findJList) return global.sweet2.fire({
        icon: "error",
        title: "Something Wrong",
        text: `You need to install java ${version} to use this version!`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
    
    if (javalabel) javalabel.innerText = `Java: ${findJList} (Detect)`
    if (javalist) javalist.value = findJList
}

edit && edit.addEventListener("click", () => {
    window.location.href = "select.html"
})

window.addEventListener("DOMContentLoaded", async () => {
    const desktopPath = await global.ipcRenderer.invoke(constDBPIPE.CONSTDB.CHANNEL, { "path": constDBPIPE.CONSTDB.DESKTOPPATH })

    if (localpath) localpath.value = desktopPath

    global.ipcRenderer.on(ipcChannelPIPE.RENDERER.RETURN_CHOOSEBOX, (event, message) => {
        if (localpath) localpath.value = message
    })

    pathbutton && pathbutton.addEventListener("click", () => {
        global.ipcRenderer.send(ipcChannelPIPE.MAIN.NEW_CHOOSEBOX)
    })

    const message = await global.ipcRenderer.invoke(ipcChannelPIPE.MAIN.TEMPDB_GET, { "path": GLOBAL.SERVERTYPE })

    await java.refresh()

    const jlist = await java.getList()
    const jtype = await java.getTypeMap()

    jlist.forEach((element) => {
        const option = document.createElement("option")
        option.value = element
        option.text = `${jtype.get(element)}-${element}`
        javalist.appendChild(option)
    })

    javalist.addEventListener("change", async () => {
        if (javalabel) javalabel.innerText = `Java: ${javalist.value}`
    })

    versionlist.addEventListener("change", async () => {
        await displayJava(message, jlist)
    })

    const type = document.getElementById("type")
    if (type) type.innerText = `Type: ${message}`

    if (message === serverPIPE.MOJANGRELEASE) {
        let manifest = await api.fetchMojangManifest("release")

        manifest.forEach((value) => {
            URLMap.set(value.id, value.url)
            const option = document.createElement("option")
            option.innerText = value.id
            versionlist && versionlist.appendChild(option)
        })

        await displayJava(message, jlist)
    } else if (message === serverPIPE.MOJANGSNAPSHOT) {
        let manifest = await api.fetchMojangManifest("snapshot")

        manifest.forEach((value) => {
            URLMap.set(value.id, value.url)
            const option = document.createElement("option")
            option.innerText = value.id
            versionlist && versionlist.appendChild(option)
        })

        await displayJava(message, jlist)
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

        await displayJava(message, jlist)
    } else if (message === serverPIPE.PURPURMC) {
        let manifest = await api.fetchPurpurManifest()

        manifest.forEach((value) => {
            URLMap.set(value, `https://api.pl3x.net/v2/purpur/${value}/latest/download`)
            const option = document.createElement("option")
            option.innerText = value
            versionlist && versionlist.appendChild(option)
        })

        await displayJava(message, jlist)
    } else if (message === serverPIPE.AIRPLANE) {
        let manifest = await api.fetchAirplane()

        manifest.forEach((value) => {
            const URLValue = value.url
            URLMap.set(value.name, `${value.url}/lastSuccessfulBuild/artifact/target/launcher-${URLValue.length === 3 ? `${URLValue[0]}${URLValue[1]}`.toLowerCase() : URLValue[0].toLowerCase()}.jar`)
            const option = document.createElement("option")
            option.innerText = value.name.split("-").join(" ")
            versionlist && versionlist.appendChild(option)
        })

        await displayJava(message, jlist)
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

    done && done.addEventListener("click", async () => {    
        const envVar = document.getElementById("envvar") as HTMLInputElement
        const nogui = document.getElementById("nogui") as HTMLInputElement
        const eula = document.getElementById("eula") as HTMLInputElement
        const autorun = document.getElementById("autorun") as HTMLInputElement
    
        const consolevalue = consoletitle.value
        const foldervalue = foldername.value

        const jpath = await java.getPathMap()
    
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
            "path": GLOBAL.AUTORUN,
            "data": autorun.checked
        })
    
        global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
            "path": GLOBAL.LOCATION,
            "data": localpath.value
        })
    
        global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, {
            "path": GLOBAL.JAVAPATH,
            "data": jpath.get(javalist.value)
        })
    
        window.location.href = "final.html"
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

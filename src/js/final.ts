import open from "open"
import file from "fs"
import path from "path"
import stringify from "json-stringify-pretty-compact"
import api from "./api"
import serverTypePIPE from "../pipe/servertype"
import * as ipcChannelPIPE from "../pipe/ipcChannel"
// import { exec } from "child_process"
import { COLLECTION, GLOBAL, STORE } from "../pipe/tempDB"
import { TerminalConfig } from "../pipe/terminal"

const loop = document.getElementById("loop")?.style
const check_icon = document.getElementById("check-icon")?.style
const homepage = document.getElementById("homepage")
let isFinishSetup = false

homepage && homepage.addEventListener("click", () => {
    if (isFinishSetup) {
        window.location.href = "select.html"
    }
})

type spinnerType = { 
    "id": number,
    "message": string, 
    "document": HTMLElement, 
    "interval": any 
}

function loadingSpinner(number: number, message: string): spinnerType {
    let time = 0
    const label = document.getElementById(`label${number}`) as HTMLLabelElement
    label.innerText = message

    return {
        "id": number,
        "message": message,
        "document": label,
        "interval": setInterval(() => {
            switch (time) {
                case 0:
                    label.innerText = `${message}.`
                    break
                case 1:
                    label.innerText = `${message}..`
                    break
                case 2:
                    label.innerText = `${message}...`
                    break
                case 3:
                    label.innerText = message
                    time = -1
                    break
            }
            time++
        }, 1000)
    }
}

function spinnerFinish(loadSpinner: spinnerType) {
    clearInterval(loadSpinner.interval)
    loadSpinner.document.innerText = `${loadSpinner.message}!`
    const image = document.getElementById(`img${loadSpinner.id}`) as HTMLImageElement
    image.src = "img/svg/check.svg"
}

window.addEventListener("DOMContentLoaded",  async () => {
    const collection = await global.ipcRenderer.invoke(ipcChannelPIPE.MAIN.TEMPDB_COLLECTION, { "path": COLLECTION.PACKAGECOLLECTION })

    const consoleTitle = collection[GLOBAL.CONSOLETITLE]
    const javaENV = collection[GLOBAL.ENVVAR]
    const serverType = collection[GLOBAL.SERVERTYPE]
    const serverURL = collection[GLOBAL.SERVERURL]
    const serverVersion = collection[GLOBAL.SERVERVERSION]
    const acceptEULA = Boolean(collection[GLOBAL.EULA])
    const runWhenFinish = Boolean(collection[GLOBAL.AUTORUN])
    const implementNOGUI = `${Boolean(collection[GLOBAL.NOGUI]) ? " nogui" : ""}`
    const javaPath = collection[GLOBAL.JAVAPATH]
    const jarFile = `${String(serverType).split(" ").join("_").toLowerCase()}-${serverVersion}.jar`

    const defaultPath = path.join(collection[GLOBAL.LOCATION], collection[GLOBAL.FOLDERNAME])
    let spinnerBox = loadingSpinner(0, "Create Folder")

    // Try to create directory
    try {
        await file.mkdirSync(defaultPath)
    } catch (err) {
        clearInterval(spinnerBox.interval)
        spinnerBox.document.innerText = "Error to Create Folder"
        error()

        global.sweet2.fire({
            icon: "error",
            text: err,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        return
    } finally {
        spinnerFinish(spinnerBox)
    }

    spinnerBox = loadingSpinner(1, serverType === serverTypePIPE.SPIGOTMC ? "Compile" : "Download")

    // Download or Compile minecraft server
    try {
        switch (serverType) {
            case serverTypePIPE.AIRPLANE:
            case serverTypePIPE.PAPERMC:
            case serverTypePIPE.PURPURMC:
                await api.fetchFile(path.join(defaultPath, jarFile), serverURL, (status: number) => {
                    clearInterval(spinnerBox.interval)
                    spinnerBox = loadingSpinner(1, `Download File ${status}%`)
                })
                break
            case serverTypePIPE.MOJANGRELEASE:
            case serverTypePIPE.MOJANGSNAPSHOT:
                const gameURL = await api.fetchMojangGame(serverURL)
                await api.fetchFile(path.join(defaultPath, jarFile), gameURL, (status: number) => {
                    clearInterval(spinnerBox.interval)
                    spinnerBox = loadingSpinner(1, `Download File ${status}%`)
                })
                break
            case serverTypePIPE.SPIGOTMC:
                
                break
        }
    } catch (err) {
        clearInterval(spinnerBox.interval)
        spinnerBox.document.innerText = `Error to ${spinnerBox.message}`
        error()

        global.sweet2.fire({
            icon: "error",
            text: String(err),
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        return
    }

    spinnerFinish(spinnerBox)

    spinnerBox = loadingSpinner(serverType === serverTypePIPE.SPIGOTMC ? 3 : 2, "Create an executable file")

    const terminalConfig: TerminalConfig = {
        "title": consoleTitle,
        "execute": `java -jar "${jarFile}"${implementNOGUI}`,
        "javaPath": `${javaPath}\\bin`,
        "watchdog": true
    }

    // Try to write executable file
    try {
        await file.writeFileSync(path.join(defaultPath, "start.servertool"), stringify(terminalConfig))

        switch (process.platform) {
            case "win32":
                await file.writeFileSync(path.join(defaultPath, "start.bat"), `@echo off\nTitle ${consoleTitle}\n${javaPath ? `set JAVA_HOME=${javaPath}\nset Path=%JAVA_HOME%\\bin;%Path%\n` : ""}java ${javaENV ? `${javaENV} ` : ""}-jar "${jarFile}"${implementNOGUI}\npause`)
                break
            case "linux":
            case "darwin":
                await file.writeFileSync(path.join(defaultPath, "start.sh"), `#!/bin/bash\nPROMPT_COMMAND='echo -ne "\\033]0;${consoleTitle}\\007"'\n${javaPath ? javaPath : "java"} ${javaENV ? `${javaENV} ` : ""}-jar "${jarFile}"${implementNOGUI}`)
                break
        }
    } catch (err) {
        clearInterval(spinnerBox.interval)
        spinnerBox.document.innerText = "Error to Create an executable file"
        error()

        global.sweet2.fire({
            icon: "error",
            text: err,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        return
    }

    if (acceptEULA) {
        try {
            open("https://account.mojang.com/documents/minecraft_eula")
            await file.writeFileSync(path.join(defaultPath, "eula.txt"), `# By checking this setting, that means you agree with the Mojang Eula (https://account.mojang.com/documents/minecraft_eula).\n# This file was created by 'XyZerKunG ServerTool' on ${new Date().toLocaleString()}\neula=true`)
        } catch (err) {
            clearInterval(spinnerBox.interval)
            spinnerBox.document.innerText = "Error to create mojang eula file"
            error()

            global.sweet2.fire({
                icon: "error",
                text: err,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        }
    }

    if (runWhenFinish) {
        terminalConfig.cd = defaultPath

        const tempStoreParm: STORE = {
            "path": GLOBAL.TERMINALCONFIG,
            "data": terminalConfig
        }

        global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, tempStoreParm)

        window.location.href = "terminal.html"
    }

    spinnerFinish(spinnerBox)
    done()
})

function error() {
    homepage && homepage.classList.remove("link-dark")
    homepage && homepage.classList.add("link-danger")
    isFinishSetup = !isFinishSetup
}

function done() {
    if (check_icon) check_icon.display = "block"
    if (loop) loop.animation = "none"
    if (loop) loop.borderColor = "#5cb85c"
    if (loop) loop.transition = "border 0.5s ease-out"
    homepage && homepage.classList.remove("link-dark")
    homepage && homepage.classList.add("link-warning")
    const setuppage = document.getElementById("setuppage")
    setuppage && setuppage.classList.remove("link-dark")
    setuppage && setuppage.classList.add("link-secondary")
    isFinishSetup = !isFinishSetup
}
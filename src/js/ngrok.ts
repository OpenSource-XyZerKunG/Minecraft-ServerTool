import path from "path"
import file from "fs"

import aes from "aes256"
import bcrypt from "bcrypt"

import yaml from "yaml"

import * as ipcChannelPIPE from "../pipe/ipcChannel"
import * as constDBPIPE from "../pipe/constantDB"
import { GLOBAL, COLLECTION, CallbackCollection } from "../pipe/tempDB"
import { ngrokChannel, startParameters, killParameters } from "../pipe/ngrok"

// import { ngrokChannel } from "../pipe/ngrok"
// global.ngrokChannel = ngrokChannel

const localpath = document.getElementById("localpath") as HTMLInputElement
const pathbutton = document.getElementById("pathbutton")

const ngrokbox = document.getElementById("ngrokbox")
const ngrokdisplay = document.getElementById("ngrokdisplay")
const ngrokfolder = document.getElementById("ngrokfolder")

type spinnerType = { 
    "id": number,
    "message": string, 
    "document": HTMLElement, 
    "image": HTMLImageElement,
    "interval": any 
}

type tokenType = {
    "authtoken": string,
    "region": string,
    "encrypt": boolean,
}

async function popupPasswordSync() {
    return await global.sweet2.fire({
        icon: "question",
        text: "Enter your password",
        input: "password",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Done",
        cancelButtonText: "Back",
        showLoaderOnConfirm: true,
        reverseButtons: true,
        allowOutsideClick: () => !global.sweet2.isLoading()
    })
}

function loadingSpinner(number: number, message: string): spinnerType {
    const image = document.getElementById(`img${number}`) as HTMLImageElement
    const label = document.getElementById(`label${number}`) as HTMLLabelElement
    image.src = "img/svg/spin.svg"
    image.style.opacity = "1"
    label.innerText = message

    let time = 0

    return {
        "id": number,
        "message": message,
        "document": label,
        "image": image,
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

function finishtoken(spinnerBox: spinnerType | undefined) {
    if (spinnerBox) {
        global.sweet2.fire({
            icon: "success",
            text: "NGROK is ready!",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    
        clearInterval(spinnerBox.interval)
        spinnerBox.document.innerText = ""

        global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, { "path": GLOBAL.NGROKTOKEN, "data": global.ngrokToken })
        global.ipcRenderer.send(ipcChannelPIPE.MAIN.TEMPDB_STORE, { "path": GLOBAL.NGROKREGION, "data": global.ngrokRegion })
    }

    if (ngrokbox) ngrokbox.style.display = "none"
    if (ngrokdisplay) ngrokdisplay.style.opacity = "1"

    global.ngrokReady = true

    if (ngrokdisplay) ngrokdisplay.appendChild(createController(25565))
}

function createController(port: number) {
    let ngrokURL: string | undefined = undefined
    let IsRunning = false

    const ngrokcontroller = document.createElement("div")

    ngrokcontroller.style.display = "flex"
    ngrokcontroller.style.placeContent = "center space-between"
    ngrokcontroller.style.padding = "1rem"

    const ngrokcontroller_port = document.createElement("label")
    const ngrokcontroller_address = document.createElement("label")
    const ngrokcontroller_status = document.createElement("label")

    ngrokcontroller_port.innerText = `Port: ${port}`
    ngrokcontroller_status.innerText = `Status: Not Running`

    ngrokcontroller_address.addEventListener("click", () => {
        if (IsRunning && ngrokURL) {
          navigator.clipboard.writeText(String(ngrokURL).replace("tcp://", ""))
          
          global.sweet2.fire({
            icon: "success",
            text: "Copy to clipboard!",
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
        }
    })

    const ngrokcontroller_servicebox = document.createElement("div")

    ngrokcontroller_servicebox.style.display = "inline-block"
    
    const ngrokcontroller_start = document.createElement("img") as HTMLImageElement
    
    ngrokcontroller_start.src = "img/svg/start.svg"
    ngrokcontroller_start.alt = "Start Service"
    ngrokcontroller_start.style.marginRight = "5px"

    ngrokcontroller_start.addEventListener("mouseenter", () => {
        ngrokcontroller_start.src = "img/svg/start-fill.svg"
    })

    ngrokcontroller_start.addEventListener("mouseout", () => {
        ngrokcontroller_start.src = "img/svg/start.svg"
    })

    ngrokcontroller_start.addEventListener("click", async () => {
        if (!IsRunning) {
            const ngrokParameters: startParameters = {
                "authtoken": global.ngrokToken,
                "proto": "tcp",
                "addr": port,
            }
    
            if (global.ngrokRegion !== "default") ngrokParameters.region = global.ngrokRegion
    
            const result: string = await global.ipcRenderer.invoke(ngrokChannel.START, ngrokParameters)
    
            ngrokURL = result

            ngrokcontroller_address.innerText = result.replace("tcp://", "")
            ngrokcontroller_status.innerText = "Status: Running"

            IsRunning = !IsRunning
        }
    })

    const ngrokcontroller_kill = document.createElement("img") as HTMLImageElement

    ngrokcontroller_kill.src = "img/svg/stop.svg"
    ngrokcontroller_kill.alt = "Kill Service"

    ngrokcontroller_kill.addEventListener("mouseenter", () => {
        ngrokcontroller_kill.src = "img/svg/stop-fill.svg"
    })

    ngrokcontroller_kill.addEventListener("mouseout", () => {
        ngrokcontroller_kill.src = "img/svg/stop.svg"
    })

    ngrokcontroller_kill.addEventListener("click", () => {
        if (IsRunning && ngrokURL) {
            const ngrokParameters: killParameters = { "url": ngrokURL }

            global.ipcRenderer.send(ngrokChannel.KILL, ngrokParameters)

            ngrokcontroller_address.innerText = ""
            ngrokcontroller_status.innerText = "Status: Not Running"

            IsRunning = !IsRunning
        }
    })

    const ngrokcontroller_remove = document.createElement("img") as HTMLImageElement

    ngrokcontroller_remove.src = "img/svg/eject.svg"
    ngrokcontroller_remove.alt = "Remove Service"

    ngrokcontroller_remove.addEventListener("mouseenter", () => {
        ngrokcontroller_remove.src = "img/svg/eject-fill.svg"
    })

    ngrokcontroller_remove.addEventListener("mouseout", () => {
        ngrokcontroller_remove.src = "img/svg/eject.svg"
    })

    // v1.0.9 not support yet
    ngrokcontroller_remove.style.opacity = "0"
    // ngrokcontroller_remove.addEventListener("click", () => {
        
    // })

    ngrokcontroller_servicebox.appendChild(ngrokcontroller_start)
    ngrokcontroller_servicebox.appendChild(ngrokcontroller_kill)

    ngrokcontroller.appendChild(ngrokcontroller_servicebox)

    ngrokcontroller.appendChild(ngrokcontroller_port)
    ngrokcontroller.appendChild(ngrokcontroller_address)
    ngrokcontroller.appendChild(ngrokcontroller_status)

    ngrokcontroller.appendChild(ngrokcontroller_remove)

    return ngrokcontroller
}

async function configNGROK() {
    if (ngrokbox) ngrokbox.style.opacity = "1"

    const desktopPath = await global.ipcRenderer.invoke(constDBPIPE.CONSTDB.CHANNEL, { "path": constDBPIPE.CONSTDB.DESKTOPPATH })
    
    if (localpath) localpath.value = desktopPath
    
    global.ipcRenderer.on(ipcChannelPIPE.RENDERER.RETURN_CHOOSEBOX, (event, message) => {
        if (localpath) localpath.value = message
    })
    
    if (pathbutton) pathbutton.addEventListener("click", () => {
        global.ipcRenderer.send(ipcChannelPIPE.MAIN.NEW_CHOOSEBOX)
    })
    
    if (ngrokfolder) ngrokfolder.addEventListener("click", async () => {
        if (global.configlock) return
    
        global.configlock = true
        let spinnerBox = loadingSpinner(0, "Searching for config file")
    
        try {
            const fileStat = await file.statSync(path.join(localpath.value, "ngrok.token"))
    
            if (fileStat.isFile()) {
                clearInterval(spinnerBox.interval)
                spinnerBox = loadingSpinner(0, "Loading config file")
    
                const tokenData = await file.readFileSync(path.join(localpath.value, "ngrok.token"), "utf8")
                const ngrokParser: tokenType = yaml.parse(tokenData)
                
                if (ngrokParser.encrypt) {
                    try {
                        const resultPassword = await popupPasswordSync()

                        if (!resultPassword.isConfirmed) {
                            throw undefined
                        }

                        const firstState = aes.decrypt(resultPassword.value, Buffer.from(ngrokParser.authtoken, "base64").toString("utf8")).split(".")
                        const token = aes.decrypt(resultPassword.value, Buffer.from(firstState[0], "base64").toString("utf8"))
                        const hash = Buffer.from(firstState[1], "base64").toString("utf8")

                        const compareBoolean = await bcrypt.compareSync(`${token}${resultPassword.value}`, hash)
                        
                        if (compareBoolean) {
                            global.ngrokToken = token
                        } else {
                            throw Error("Password not match!")
                        }
                    } catch (ignore) {
                        clearInterval(spinnerBox.interval)
                        spinnerBox.image.style.opacity = "0"
                        spinnerBox.document.innerText = ""
                        global.configlock = false
                        return
                    }
                } else {
                    global.ngrokToken = ngrokParser.authtoken
                }
    
                global.ngrokRegion = ngrokParser.region

                try {
                    if (!global.ngrokToken) throw new Error("Invalid token")
                    if (!global.ngrokRegion) throw new Error("Invalid region")
                } catch (err) {
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
                    clearInterval(spinnerBox.interval)
                    spinnerBox.image.style.opacity = "0"
                    spinnerBox.document.innerText = ""
                    global.configlock = false
                }
    
                spinnerFinish(spinnerBox)
                finishtoken(spinnerBox)
            } else {
                throw new Error("Config file not found")
            }
        } catch (ignore) {
            clearInterval(spinnerBox.interval)
            spinnerBox = loadingSpinner(0, "Waiting for ngrok token")
    
            const tokenfunction = async () => {
                const resultToken = await global.sweet2.fire({
                    icon: "question",
                    text: "Connect your account using ngrok token",
                    input: "password",
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: "Next",
                    cancelButtonText: "Back",
                    showLoaderOnConfirm: true,
                    reverseButtons: true,
                    allowOutsideClick: () => !global.sweet2.isLoading()
                })
    
                if (!resultToken.isConfirmed) {
                    clearInterval(spinnerBox.interval)
                    spinnerBox.image.style.opacity = "0"
                    spinnerBox.document.innerText = ""
                    global.configlock = false
                    return
                }
    
                global.ngrokToken = String(resultToken.value)
                global.ngrokRegion = "default"
    
                if (String(resultToken.value).replaceAll(" ", "") !== "" && resultToken.value !== undefined) {
                    const passwordFunction = async () => {
                        const resultPassword = await popupPasswordSync()
    
                        if (resultPassword.isConfirmed) {
                            try {
                                if (String(resultPassword.value).replaceAll(" ", "") !== "" && resultPassword.value !== undefined) {
                                    const salt = await bcrypt.genSaltSync(12)
                                    const hashIT = await bcrypt.hashSync(`${resultToken.value}${resultPassword.value}`, salt)
                                    const token = Buffer.from(`${aes.encrypt(resultPassword.value, `${Buffer.from(aes.encrypt(resultPassword.value, resultToken.value), "utf8").toString("base64")}.${Buffer.from(hashIT, "utf8").toString("base64")}`)}`, "utf8").toString("base64")

                                    await file.writeFileSync(path.join(localpath.value, "ngrok.token"), `"authtoken": "${token}"\n"region": "default"\n"encrypt": true`)
                                } else {
                                    await file.writeFileSync(path.join(localpath.value, "ngrok.token"), `"authtoken": "${resultToken.value}"\n"region": "default"\n"encrypt": false`)
                                }
                            } catch (err) {
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
                                clearInterval(spinnerBox.interval)
                                spinnerBox.image.style.opacity = "0"
                                spinnerBox.document.innerText = ""
                                global.configlock = false
                            }
                            finishtoken(spinnerBox)
                        } else {
                            tokenfunction()
                        }
                    }
                    passwordFunction()
                } else {
                    tokenfunction()
                }
            }
    
            tokenfunction()
        }
    })        
}

// localpath.value = ___dirname
async function load() {
    const collection: CallbackCollection[] = await global.ipcRenderer.invoke(ipcChannelPIPE.MAIN.TEMPDB_COLLECTION, { "path": COLLECTION.NGROKCOLLECTION })

    global.ngrokToken = collection[GLOBAL.NGROKTOKEN]
    global.ngrokRegion = collection[GLOBAL.NGROKREGION]
    
    if (global.ngrokToken && global.ngrokRegion) {
        finishtoken(undefined)
    } else {
        configNGROK()
    }
}

load()
import sweet2 from "sweetalert2"
import { MAIN as HandlerMain } from "../pipe/ipcChannel"
import controllerPIPE from "../pipe/controller"
const { exec } = require("child_process")
const { ipcRenderer } = require("electron")

global.ipcRenderer = ipcRenderer
global.sweet2 = sweet2

if (process.platform != "win32" && process.platform != "linux" && process.platform != "darwin") {
    sweet2.fire({
        icon: "error",
        text: "Unsupported operating system, Not sure if you can create a server?",
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

exec("java -version", (error: any) => {
    if (error) {
        sweet2.fire({
            icon: "error",
            title: "Something Wrong",
            text: "You need to install java to using this!",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }
})

const min = document.getElementById("min") as HTMLImageElement
const full = document.getElementById("full") as HTMLImageElement
const close = document.getElementById("close") as HTMLImageElement

min.addEventListener("mouseenter", () => {
    min.src = "img/svg/dash-square-fill.svg"
})

min.addEventListener("mouseout", () => {
    min.src = "img/svg/dash-square.svg"
})

min.addEventListener("click", () => {
    ipcRenderer.send(HandlerMain.CONTROLLER_APP, controllerPIPE.MINIMIZE)
})

full.addEventListener("mouseenter", () => {
    full.src = "img/svg/square-fill.svg"
})

full.addEventListener("mouseout", () => {
    full.src = "img/svg/square.svg"
})

full.addEventListener("click", () => {
    ipcRenderer.send(HandlerMain.CONTROLLER_APP, controllerPIPE.FULLSCREEN)
})

close.addEventListener("mouseenter", () => {
    close.src = "img/svg/x-circle-fill.svg"
})

close.addEventListener("mouseout", () => {
    close.src = "img/svg/x-circle.svg"
})

close.addEventListener("click", () => {
    ipcRenderer.send(HandlerMain.CONTROLLER_APP, controllerPIPE.CLOSE)
})
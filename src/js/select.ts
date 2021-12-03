import { MAIN } from "../pipe/ipcChannel"
import { STORE, GLOBAL } from "../pipe/tempDB"
import severtypePIPE from "../pipe/servertype"

const originElement = document.getElementById("origin")
const snapshot = document.getElementById("snapshot")
const bukkit = document.getElementById("bukkit")
const paper = document.getElementById("paper")
const purpur = document.getElementById("purpur")
const airplane = document.getElementById("airplane")

const tempStore: STORE = {
    "path": GLOBAL.SERVERTYPE,
    "data": severtypePIPE.NONE
}

originElement && originElement.addEventListener("click", () => {
    tempStore.data = severtypePIPE.MOJANGRELEASE
    global.ipcRenderer.send(MAIN.TEMPDB_STORE, tempStore)
    setup()
})

snapshot && snapshot.addEventListener("click", () => {
    tempStore.data = severtypePIPE.MOJANGSNAPSHOT
    global.ipcRenderer.send(MAIN.TEMPDB_STORE, tempStore)
    setup()
})

bukkit && bukkit.addEventListener("click", () => {
    tempStore.data = severtypePIPE.SPIGOTMC
    global.ipcRenderer.send(MAIN.TEMPDB_STORE, tempStore)
    setup()
})

paper && paper.addEventListener("click", () => {
    tempStore.data = severtypePIPE.PAPERMC
    global.ipcRenderer.send(MAIN.TEMPDB_STORE, tempStore)
    setup()
})

purpur && purpur.addEventListener("click", () => {
    tempStore.data = severtypePIPE.PURPURMC
    global.ipcRenderer.send(MAIN.TEMPDB_STORE, tempStore)
    setup()
})

airplane && airplane.addEventListener("click", () => {
    tempStore.data = severtypePIPE.AIRPLANE
    global.ipcRenderer.send(MAIN.TEMPDB_STORE, tempStore)
    setup()
})

function setup() {
    window.location.href = "setup.html"
}
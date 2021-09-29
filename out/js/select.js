const origin = document.getElementById("origin")
const snapshot = document.getElementById("snapshot")
const bukkit = document.getElementById("bukkit")
const paper = document.getElementById("paper")
const purpur = document.getElementById("purpur")
const types = require("./var")

origin.addEventListener("click", () => {
    ipcRenderer.send("post:type", types.RELEASE)
    setup()
})

snapshot.addEventListener("click", () => {
    ipcRenderer.send("post:type", types.SNAPSHOT)
    setup()
})

bukkit.addEventListener("click", () => {
    ipcRenderer.send("post:type", types.SPIGOTMC)
    setup()
})

paper.addEventListener("click", () => {
    ipcRenderer.send("post:type", types.PAPERMC)
    setup()
})

purpur.addEventListener("click", () => {
    ipcRenderer.send("post:type", types.PURPURMC)
    setup()
})

function setup() {
    window.location.href = "setup.html"
}
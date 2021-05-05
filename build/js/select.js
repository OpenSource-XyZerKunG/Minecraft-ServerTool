const origin = document.getElementById("origin")
const snapshot = document.getElementById("snapshot")
const bukkit = document.getElementById("bukkit")
const paper = document.getElementById("paper")
const types = require("./var")

origin.addEventListener("click", () => {
    socket.emit("post:type", types.RELEASE)
    setup()
})

snapshot.addEventListener("click", () => {
    socket.emit("post:type", types.SNAPSHOT)
    setup()
})

bukkit.addEventListener("click", () => {
    socket.emit("post:type", types.SPIGOTMC)
    setup()
})

paper.addEventListener("click", () => {
    socket.emit("post:type", types.PAPERMC)
    setup()
})

function setup() {
    window.location.href = "setup.html"
}
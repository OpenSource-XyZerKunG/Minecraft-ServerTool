const origin = document.getElementById("origin")
const snapshot = document.getElementById("snapshot")
const bukkit = document.getElementById("bukkit")
const paper = document.getElementById("paper")
const purpur = document.getElementById("purpur")
const yatopia = document.getElementById("yatopia")
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

purpur.addEventListener("click", () => {
    socket.emit("post:type", types.PURPURMC)
    setup()
})

yatopia.addEventListener("click", () => {
    socket.emit("post:type", types.YATOPIA)
    setup()
})

function setup() {
    window.location.href = "setup.html"
}
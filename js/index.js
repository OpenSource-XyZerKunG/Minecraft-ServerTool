const origin = document.getElementById("origin")
const snapshot = document.getElementById("snapshot")
const bukkit = document.getElementById("bukkit")
const paper = document.getElementById("paper")

origin.addEventListener('click', () => {
    ipc.sendSync("async-message", "origin")
})

snapshot.addEventListener('click', () => {
    ipc.sendSync("async-message", "snapshot")
})

bukkit.addEventListener('click', () => {
    ipc.sendSync("async-message", "bukkit")
})

paper.addEventListener('click', () => {
    ipc.sendSync("async-message", "paper")
})
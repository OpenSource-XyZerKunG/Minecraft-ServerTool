const origin = document.getElementById("origin")
const snapshot = document.getElementById("snapshot")
const bukkit = document.getElementById("bukkit")
const paper = document.getElementById("paper")

origin.addEventListener('click', () => {
    ipc.send("async-message", "id:type:origin")
    setup()
})

snapshot.addEventListener('click', () => {
    ipc.send("async-message", "id:type:snapshot")
    setup()
})

bukkit.addEventListener('click', () => {
    ipc.send("async-message", "id:type:bukkit")
    setup()
})

paper.addEventListener('click', () => {
    ipc.send("async-message", "id:type:paper")
    setup()
})

function setup() {
    window.location.href = "setup.html"
}
const path = require("path")

document.getElementById("edit").addEventListener("click", () => {
    window.location.href = path.join(__dirname, "select.html")
})

window.addEventListener("DOMContentLoaded", () => {
    socket.emit("post:app", "get:type")
    socket.on("post:type", (message) => {
        document.getElementById("type").innerText = "Type: " + String(message)
    }) 
})
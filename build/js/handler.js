if (process.platform == "linux" || process.platform == "darwin") {
    sweet2.fire({
        icon: "info",
        text: "Not fully support But you can do it",
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
} else if (process.platform != "win32") {
    sweet2.fire({
        icon: "error",
        text: "Unknown operating system, not sure you can?",
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

const { exec } = require("child_process")
exec("java -version", (error) => {
    if (error) {
        sweet2.fire({
            icon: "error",
            title: "Something Wrong",
            text: "You need to install java to build this!",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }
})

const {io} = require("socket.io-client")
const socket = io("ws://localhost:45785", {
    "autoConnect": false
})

const connect = document.getElementById("connect")
const min = document.getElementById("min")
const full = document.getElementById("full")
const close = document.getElementById("close")

socket.on("connect", () => {
    connect.src = "img/svg/bar-char-fill.svg"
})

socket.on("disconnect", () => {
    socket.connect()
})

socket.on("connect_error", () => {
    socket.connect()
})

socket.connect()

connect.addEventListener("click", () => {
    if (String(connect.src).endsWith("img/svg/bar-char.svg")) {
        let web = String(window.location.href).split("/")
        window.location.href = web[web.length - 1]
    }
})

min.addEventListener("mouseenter", () => {
    min.src = "img/svg/dash-square-fill.svg"
})

min.addEventListener("mouseout", () => {
    min.src = "img/svg/dash-square.svg"
})

full.addEventListener("mouseenter", () => {
    full.src = "img/svg/square-fill.svg"
})

full.addEventListener("mouseout", () => {
    full.src = "img/svg/square.svg"
})

close.addEventListener("mouseenter", () => {
    close.src = "img/svg/x-circle-fill.svg"
})

close.addEventListener("mouseout", () => {
    close.src = "img/svg/x-circle.svg"
})

min.addEventListener("click", () => {
    socket.emit("post:app", "*e^Q$xV?z>6[$X@9")
})

full.addEventListener("click", () => {
    socket.emit("post:app", "A%Q3,BUNbw6Sxjtw")
})

close.addEventListener("click", () => {
    socket.emit("post:app", "X=E[8}N&L;j6nN}9")
})
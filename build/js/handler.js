const sweet2 = require("sweetalert2")
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

const { ipcRenderer } = require("electron")
const min = document.getElementById("min")
const full = document.getElementById("full")
const close = document.getElementById("close")

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
    ipcRenderer.send("post:app", "*e^Q$xV?z>6[$X@9")
})

full.addEventListener("click", () => {
    ipcRenderer.send("post:app", "A%Q3,BUNbw6Sxjtw")
})

close.addEventListener("click", () => {
    ipcRenderer.send("post:app", "X=E[8}N&L;j6nN}9")
})
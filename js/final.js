const Swal = require("sweetalert2")
const loop = document.getElementById("loop").style
const check_icon = document.getElementById("check-icon").style
let total = 0
let file = 0
let save = 0

window.addEventListener('DOMContentLoaded', () => {
    socket.emit("message", "want:setup")
    socket.on("status", (message) => {
        let data = String(message)
        let array = data.split(":")
        switch (array[0]) {
            case "error":
                switch (array[1]) {
                    case "concode":
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Response Status Code: " + array[2]
                        })
                        break
                    case "download":
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Download or Create File"
                        })
                        break
                    default:
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: array[1]
                        })
                        break
                }
                break
            case "status":
                switch (array[1]) {
                    case "total":
                        total = Number(array[2])
                        break
                    case "rec":
                        let download = Number(array[2])
                        download = ((download*100)/total) - 10
                        document.getElementById("progressbar").style.width = file + "%"
                        if (save < download) {
                            file = file + (download - save)
                            save = download
                        }
                        break
                    case "done_createfolder":
                        for (i = 0; i < 10; i++) {
                            file++
                            document.getElementById("progressbar").style.width = file + "%"
                        }
                        break
                    case "done_download":

                        break
                    case "done_createrun":
                        for (i = 0; i < 10; i++) {
                            file++
                            document.getElementById("progressbar").style.width = file + "%"
                        }
                        break
                }
                break
            case "done":
                done()
                break
        }
    })
})

function done() {
    check_icon.display = "block"
    loop.animation = "none"
    loop.borderColor = "#5cb85c"
    loop.transition = "border 0.5s ease-out"
}

const sweet2 = require("sweetalert2")
const file = require("fs")
const path = require("path")
const types = require("./var")
const request = require("request")
const loop = document.getElementById("loop").style
const check_icon = document.getElementById("check-icon").style

window.addEventListener('DOMContentLoaded', () => {
    socket.emit("post:app", "get:all")
    socket.on("post:all", (message) => {
        let data = String(message).split(":don'ttypethis:(:");
        let intvars0 = 0
        document.getElementById("label0").innerText = "Create Folder"
        const loop0 = setInterval(() => {
            switch (intvars0) {
                case 0:
                    document.getElementById("label0").innerText = "Create Folder."
                    break
                case 1:
                    document.getElementById("label0").innerText = "Create Folder.."
                    break
                case 2:
                    document.getElementById("label0").innerText = "Create Folder..."
                    break
                case 3:
                    document.getElementById("label0").innerText = "Create Folder"
                    intvars0 = -1
                    break
            }
            intvars0++
        }, 1000)
        file.mkdir(path.join(__dirname, data[1]), (err) => {
            if (err) {
                sweet2.fire({
                    icon: "error",
                    text: err
                })
                clearInterval(loop0)
                document.getElementById("label0").innerText = "Error to Create Folder"
                return
            }
            clearInterval(loop0)
            intvars0 = 0
            document.getElementById("label0").innerText = "Create Folder!"
            document.getElementById("img0").src = "img/svg/check.svg"
            if (data[7] == types.SPIGOTMC) {
                
            } else {
                document.getElementById("label1").innerText = "Download File"
                let download = 0
                const loop1 = setInterval(() => {
                    switch (intvars0) {
                        case 0:
                            document.getElementById("label1").innerText = "Download File. " + download + "%"
                            break
                        case 1:
                            document.getElementById("label1").innerText = "Download File.. " + download + "%"
                            break
                        case 2:
                            document.getElementById("label1").innerText = "Download File... " + download + "%"
                            break
                        case 3:
                            document.getElementById("label1").innerText = "Download File " + download + "%"
                            intvars0 = -1
                            break
                    }
                    intvars0++
                }, 1000)
                const function_download = (url) => {
                    // Download File
                    let fileurl = path.join(__dirname, data[1], data[7].replaceAll(" ", "").toLowerCase() + "-" + data[3] + ".jar")
                    const filestream = file.createWriteStream(fileurl)
                    let totalBytes = 0
                    let receivedBytes = 0
                    try {
                        request.get(url).on("response", (res) => {
                            if (res.statusCode != 200) {
                                clearInterval(loop1)
                                document.getElementById("label1").innerText = "Error to Download File"
                                sweet2.fire({
                                    icon: "error",
                                    text: "Response status: " + res.statusCode
                                })
                                return
                            }
                            totalBytes = res.headers["content-length"]
                        }).on("data", (chunk) => {
                            receivedBytes += chunk.length
                            download = Math.floor((receivedBytes / totalBytes) * 100)
                            document.getElementById("label1").innerText = "Download File " + download + "%"
                        }).pipe(filestream).on("error", (err) => {
                            clearInterval(loop1)
                            document.getElementById("label1").innerText = "Error to Download File"
                            sweet2.fire({
                                icon: "error",
                                text: String(err)
                            })
                        })

                        filestream.on("finish", () => {
                            filestream.close()
                            clearInterval(loop1)
                            document.getElementById("img1").src = "img/svg/check.svg"
                            document.getElementById("label1").innerText = "Download File!"
                        })

                        filestream.on("error", (err) => {
                            clearInterval(loop1)
                            document.getElementById("label1").innerText = "Error to Download File"
                            sweet2.fire({
                                icon: "error",
                                text: String(err)
                            })
                        })
                    }catch (err) {
                        clearInterval(loop1)
                        document.getElementById("label1").innerText = "Error to Download File"
                        sweet2.fire({
                            icon: "error",
                            text: String(err)
                        })
                    }
                }
                if (data[7] == types.RELEASE) {
                    fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then((json) => {return json.json()}).then((jsonres) => {
                        let versions = jsonres.versions
                        for (value in versions) {
                            let list = versions[value]
                            if (list.id == data[3]) {
                                fetch(list.url).then((json) => {return json.json()}).then((res) => {
                                    function_download(res.downloads.server.url)
                                })
                            }
                        }
                    })
                }else if (data[7] == types.PAPERMC) {
                    function_download("https://papermc.io/api/v1/paper/" + data[3] + "/latest/download")
                }else {
                    sweet2.fire({
                        icon: "error",
                        text: "Unknown Type"
                    })
                }
            }
        })
    })
})

function done() {
    check_icon.display = "block"
    loop.animation = "none"
    loop.borderColor = "#5cb85c"
    loop.transition = "border 0.5s ease-out"
}
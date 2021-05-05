const path = require("path")
const types = require("./var")

document.getElementById("edit").addEventListener("click", () => {
    window.location.href = path.join(__dirname, "select.html")
})

window.addEventListener("DOMContentLoaded", () => {
    socket.emit("post:app", "get:type")
    socket.on("post:type", (message) => {
        document.getElementById("type").innerText = "Type: " + String(message)
        if (message == types.RELEASE) {
            fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then((res) => {return res.json()}).then((data) => {
                let versions = data.versions
                for (value in versions) {
                    let list = versions[value]
                    if (list.type == "release") {
                        const option = document.createElement("option")
                        option.innerText = list.id
                        document.getElementById("versionlist").appendChild(option)
                    }
                }
            })
        }else if (message == types.SNAPSHOT) {
            fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then((res) => {return res.json()}).then((data) => {
                let versions = data.versions
                for (value in versions) {
                    let list = versions[value]
                    if (list.type != "release") {
                        const option = document.createElement("option")
                        option.innerText = list.id
                        document.getElementById("versionlist").appendChild(option)
                    }
                }
            })
        }else if (message == types.PAPERMC) {
            fetch("https://papermc.io/api/v1/paper").then((res) => {return res.json()}).then((data) => {
                let versions = data.versions
                for (value in versions) {
                    const option = document.createElement("option")
                    option.innerText = versions[value]
                    document.getElementById("versionlist").appendChild(option)
                }
            })
        }
    })
    if (process.platform == "win32") {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "css/terminal-windows.css"
        document.getElementById("folderimage").src = "img/win-file.png"
        document.body.appendChild(link)
    }else if (process.platform == "darwin") {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "css/terminal-mac.css"
        document.body.appendChild(link)
        document.getElementById("folderimage").src = "img/mac-file.png"
    }
})

const consoletitle = document.getElementById("consoletitle")
const foldername = document.getElementById("foldername")
const terminallabel = document.getElementById("terminal-text")
const folderlabel = document.getElementById("folderlabel")

consoletitle.addEventListener("input", () => {
    terminallabel.innerText = consoletitle.value
})

foldername.addEventListener("input", () => {
    folderlabel.innerText = foldername.value
})

document.getElementById("done").addEventListener("click", () => {
    if (String(consoletitle.value).replaceAll(" ", "") != "" && String(foldername.value).replaceAll(" ", "") != "") {
        socket.emit("post:data", consoletitle.value + "," + foldername.value)
        window.location.href = "final.html"
    }
})
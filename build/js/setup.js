const path = require("path")
const types = require("./var")
const versionlist = document.getElementById("versionlist")
const localpath = document.getElementById("localpath")
const pathbutton = document.getElementById("pathbutton")

document.getElementById("edit").addEventListener("click", () => {
    window.location.href = path.join(__dirname, "select.html")
})

window.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("post:app", "get:desktop")
    ipcRenderer.on("post:desktop", (event, message) => {
        localpath.value = message
    })
    ipcRenderer.on("post:choosebox", (event, message) => {
        console.log(message)
        let array = String(message).split(":")
        if (array[0] == "false") {
            localpath.value = array[1]
        }
    })
    pathbutton.addEventListener("click", () => {
        ipcRenderer.send("post:app", "get:choosebox")
    })
    ipcRenderer.send("post:app", "get:type")
    ipcRenderer.on("post:type", (event, message) => {
        document.getElementById("type").innerText = "Type: " + String(message)
        if (message == types.RELEASE) {
            fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then((res) => {return res.json()}).then((data) => {
                let versions = data.versions
                for (value in versions) {
                    let list = versions[value]
                    if (list.type == "release") {
                        const option = document.createElement("option")
                        option.innerText = list.id
                        versionlist.appendChild(option)
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
                        versionlist.appendChild(option)
                    }
                }
            })
        }else if (message == types.PAPERMC) {
            fetch("https://papermc.io/api/v1/paper").then((res) => {return res.json()}).then((data) => {
                let versions = data.versions
                for (value in versions) {
                    const option = document.createElement("option")
                    option.innerText = versions[value]
                    versionlist.appendChild(option)
                }
            })
        }else if (message == types.SPIGOTMC) {
            fetch("https://hub.spigotmc.org/nexus/service/local/repositories/snapshots/content/org/spigotmc/spigot-api/maven-metadata.xml").then((res) => {return res.text()}).then((data) => {
                const xml = new DOMParser().parseFromString(data, "text/xml")
                const list = xml.getElementsByTagName("metadata")[0].getElementsByTagName("versioning")[0].getElementsByTagName("versions")[0].getElementsByTagName("version")
                let array = ""
                for (value = list.length - 1; value > - 1; value--) {
                    let vars = list[value].childNodes[0].nodeValue.split("-")[0]
                    if (!array.includes(vars)) {
                        array += vars
                        const option = document.createElement("option")
                        option.innerText = vars
                        versionlist.appendChild(option)
                    }
                }
            })
        }else if (message == types.PURPURMC) {
            fetch("https://purpur.pl3x.net/api/v1/purpur").then((res) => {return res.json()}).then((data) => {
                let versions = data.versions
                for (value in versions) {
                    const option = document.createElement("option")
                    option.innerText = versions[value]
                    versionlist.appendChild(option)
                }
            })
        }else if (message == types.YATOPIA) {
            fetch("https://api.yatopiamc.org/v2/latestBuild").then((res) => {return res.json()}).then((data) => {
                const option = document.createElement("option")
                option.innerText = String(data.branch.name).split("/")[1]
                versionlist.appendChild(option)
            })
        }
    })
    if (process.platform == "win32") {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "css/terminal-windows.css"
        document.getElementById("folderimage").src = "img/win-file.png"
        document.body.appendChild(link)
    } else if (process.platform == "darwin") {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "css/terminal-mac.css"
        document.body.appendChild(link)
        document.getElementById("folderimage").src = "img/mac-file.png"
    } else if (process.platform == "linux") {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "css/terminal-linux.css"
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
    if (String(consoletitle.value).replaceAll(" ", "") != "" && String(foldername.value).replaceAll(" ", "") != "" && String(versionlist.value).replaceAll(" ", "") != "") {
        ipcRenderer.send("post:data", consoletitle.value + ":don'ttypethis:(:" + foldername.value + ":don'ttypethis:(:" + document.getElementById("envvar").value + ":don'ttypethis:(:" + versionlist.value + ":don'ttypethis:(:" + Boolean(document.getElementById("nogui").checked) + ":don'ttypethis:(:" + Boolean(document.getElementById("eula").checked) + ":don'ttypethis:(:" + Boolean(document.getElementById("autorun").checked) + ":don'ttypethis:(:" + localpath.value)
        window.location.href = "final.html"
    }else {
        sweet2.fire({
            icon: "error",
            title: "Something Wrong",
            text: "Make sure you have entered the information",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }
})
const open = require("open")
const file = require("fs")
const path = require("path")
const types = require("./var")
const request = require("request")
const loop = document.getElementById("loop").style
const check_icon = document.getElementById("check-icon").style
const homepage = document.getElementById("homepage")
let isFinishSetup = false

homepage.addEventListener("click", () => {
    if (isFinishSetup) {
        window.location.href = "select.html"
    }
})

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send("post:app", "get:all")
    ipcRenderer.on("post:all", (event, message) => {
        const data = String(message).split(":don'ttypethis:(:");
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
        file.mkdir(path.join(data[8], data[1]), (err) => {
            if (err) {
                sweet2.fire({
                    icon: "error",
                    text: err,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                })
                clearInterval(loop0)
                document.getElementById("label0").innerText = "Error to Create Folder"
                return
            }
            clearInterval(loop0)
            intvars0 = 0
            document.getElementById("label0").innerText = "Create Folder!"
            document.getElementById("img0").src = "img/svg/check.svg"
            const createbasicfile = (labelint) => {
                intvars0 = 0
                const loop2 = setInterval(() => {
                    switch (intvars0) {
                        case 0:
                            document.getElementById("label" + labelint).innerText = "Create Run File. "
                            break
                        case 1:
                            document.getElementById("label" + labelint).innerText = "Create Run File.. "
                            break
                        case 2:
                            document.getElementById("label" + labelint).innerText = "Create Run File... "
                            break
                        case 3:
                            document.getElementById("label" + labelint).innerText = "Create Run File "
                            intvars0 = -1
                            break
                    }
                    intvars0++
                }, 1000)
                let nogui = ""
                if (data[4] == "true") {
                    nogui = " nogui"
                }
                file.writeFile(path.join(data[8], data[1], "start.xyzerconfig"), {
                    "title": data[0],
                    "execute": `java -jar "${data[7].replaceAll(" ", "").toLowerCase()}-${data[3]}.jar" ${nogui}`,
                    "watchdog": true
                }, (err) => {
                    if (err) {
                        clearInterval(loop2)
                        document.getElementById("label" + labelint).innerText = "Error to Create XyZerConfig File"
                        sweet2.fire({
                            icon: "error",
                            text: String(err),
                            showClass: {
                                popup: 'animate__animated animate__fadeInDown'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutUp'
                            }
                        })
                    }
                })
                switch (process.platform) {
                    case "win32":
                        file.writeFile(path.join(data[8], data[1], "start.bat"), "@echo off\nTitle " + data[0] + '\njava -jar "' + data[7].replaceAll(" ", "").toLowerCase() + "-" + data[3] + '.jar"' + nogui + "\npause", (err) => {
                            if (err) {
                                clearInterval(loop2)
                                document.getElementById("label" + labelint).innerText = "Error to Create Basic File"
                                sweet2.fire({
                                    icon: "error",
                                    text: String(err),
                                    showClass: {
                                        popup: 'animate__animated animate__fadeInDown'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animate__fadeOutUp'
                                    }
                                })
                            }
                        })
                        break
                    case "linux":
                    case "darwin":
                        file.writeFile(path.join(data[8], data[1], "start.sh"), '#!/bin/bash\nPROMPT_COMMAND=\'echo -ne "\\033]0;{titletext}\\007"\'\n'.replaceAll("{titletext}", data[0]) + 'java -jar "' + data[7].replaceAll(" ", "").toLowerCase() + "-" + data[3] + '.jar"' + nogui, (err) => {
                            if (err) {
                                clearInterval(loop2)
                                document.getElementById("label" + labelint).innerText = "Error to Create Basic File"
                                sweet2.fire({
                                    icon: "error",
                                    text: String(err),
                                    showClass: {
                                        popup: 'animate__animated animate__fadeInDown'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animate__fadeOutUp'
                                    }
                                })
                            }
                        })
                        break
                }
                if (data[5] == "true") {
                    open("https://account.mojang.com/documents/minecraft_eula")
                    file.writeFile(path.join(data[8], data[1], "eula.txt"), "# By changing settings to you, you agree with the Mojang Eula (https://account.mojang.com/documents/minecraft_eula).\n# This file was created by XyZerKunG ServerTool on " + new Date().toLocaleString() + "\neula=true", (err) => {
                        if (err) {
                            clearInterval(loop2)
                            document.getElementById("label" + labelint).innerText = "Error to Create Basic File"
                            sweet2.fire({
                                icon: "error",
                                text: String(err),
                                showClass: {
                                    popup: 'animate__animated animate__fadeInDown'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutUp'
                                }
                            })
                        }
                    })
                }
                clearInterval(loop2)
                document.getElementById("img" + labelint).src = "img/svg/check.svg"
                document.getElementById("label" + labelint).innerText = "Create Basic File!"
                done()
                isFinishSetup = true
            }
            if (data[7] == types.SPIGOTMC) {
                document.getElementById("specialbox").style.display = "inline-block"
                document.getElementById("label1").innerText = "Download Tool"
                let download = 0
                const loop1 = setInterval(() => {
                    switch (intvars0) {
                        case 0:
                            document.getElementById("label1").innerText = "Download Tool. " + download + "%"
                            break
                        case 1:
                            document.getElementById("label1").innerText = "Download Tool.. " + download + "%"
                            break
                        case 2:
                            document.getElementById("label1").innerText = "Download Tool... " + download + "%"
                            break
                        case 3:
                            document.getElementById("label1").innerText = "Download Tool " + download + "%"
                            intvars0 = -1
                            break
                    }
                    intvars0++
                }, 1000)
                ipcRenderer.send("post:app", "spigottool")
                ipcRenderer.on("statustool", (event, status) => {
                    download = Number(status)
                    document.getElementById("label1").innerText = "Build Spigot "
                    if (download == 100) {
                        clearInterval(loop1)
                        document.getElementById("img1").src = "img/svg/check.svg"
                        document.getElementById("label1").innerText = "Download Tool!"
                        intvars0 = 0
                        let loopbuildtext = "Build Spigot"
                        const loopbuild = setInterval(() => {
                            switch (intvars0) {
                                case 0:
                                    document.getElementById("label2").innerText = loopbuildtext + ". "
                                    break
                                case 1:
                                    document.getElementById("label2").innerText = loopbuildtext + ".. "
                                    break
                                case 2:
                                    document.getElementById("label2").innerText = loopbuildtext + "... "
                                    break
                                case 3:
                                    document.getElementById("label2").innerText = loopbuildtext + " "
                                    intvars0 = -1
                                    break
                            }
                            intvars0++
                        }, 1000)
                        const filespigot = data[7].replaceAll(" ", "").toLowerCase() + "-" + data[3] + ".jar"
                        let build = exec("cd " + path.join(data[8], data[1]) + " && java -jar spigottool.jar --rev " + data[3])
                        build.stderr.on("data", (data) => {
                            console.log(data.toString())
                        })
                        build.stdout.on("data", (data) => {
                            if (!String(data).includes("@users.noreply.github.com")) {
                                console.log(data.toString())   
                            }
                        })
                        build.on("exit", (exitCode) => {
                            if (exitCode == 0) {
                                intvars0 = 0
                                loopbuildtext = "Clean up in 10s"
                                setTimeout(() => {
                                    loopbuildtext = "Clean up"
                                    file.readdir(path.join(data[8], data[1]), (err, files) => {
                                        if (err) {
                                            sweet2.fire({
                                                icon: "error",
                                                text: String(err),
                                                showClass: {
                                                    popup: 'animate__animated animate__fadeInDown'
                                                },
                                                hideClass: {
                                                    popup: 'animate__animated animate__fadeOutUp'
                                                }
                                            })
                                            return
                                        }    
                                    
                                        for (datafile = 0; datafile < files.length; datafile++) {
                                            const filename = files[datafile]
                                            if (filename != filespigot) {
                                                if (file.lstatSync(path.join(data[8], data[1], filename)).isDirectory()) {
                                                    file.rmdir(path.join(data[8], data[1], filename), {recursive: true}, (err) => {
                                                        if (err) {
                                                            sweet2.fire({
                                                                icon: "error",
                                                                text: String(err),
                                                                showClass: {
                                                                    popup: 'animate__animated animate__fadeInDown'
                                                                },
                                                                hideClass: {
                                                                    popup: 'animate__animated animate__fadeOutUp'
                                                                }
                                                            })
                                                        }
                                                    })
                                                }else {
                                                    file.unlink(path.join(data[8], data[1], filename), (err) => {
                                                        if (err) {
                                                            sweet2.fire({
                                                                icon: "error",
                                                                text: String(err),
                                                                showClass: {
                                                                    popup: 'animate__animated animate__fadeInDown'
                                                                },
                                                                hideClass: {
                                                                    popup: 'animate__animated animate__fadeOutUp'
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                            if (datafile == (files.length - 1)) {
                                                clearInterval(loopbuild)
                                                document.getElementById("label2").innerText = "Build and Clean up!"
                                                document.getElementById("img2").src = "img/svg/check.svg"
                                                createbasicfile(3)
                                            }
                                        }
                                    })
                                }, 10000)
                            }
                        })
                        build.on("error", (err) => {
                            sweet2.fire({
                                icon: "error",
                                text: String(err),
                                showClass: {
                                    popup: 'animate__animated animate__fadeInDown'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutUp'
                                }
                            })
                        })
                    }
                })
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
                    let fileurl = path.join(data[8], data[1], data[7].replaceAll(" ", "").toLowerCase() + "-" + data[3] + ".jar")
                    const filestream = file.createWriteStream(fileurl)
                    let totalBytes = 0
                    let receivedBytes = 0
                    try {
                        request.get(url).on("response", (res) => {
                            if (res.statusCode != 200) {
                                filestream.close()
                                clearInterval(loop1)
                                document.getElementById("label1").innerText = "Error to Download File"
                                sweet2.fire({
                                    icon: "error",
                                    text: "Response status: " + res.statusCode,
                                    showClass: {
                                        popup: 'animate__animated animate__fadeInDown'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animate__fadeOutUp'
                                    }
                                })
                                return
                            }
                            totalBytes = res.headers["content-length"]
                        }).on("data", (chunk) => {
                            receivedBytes += chunk.length
                            download = Math.floor((receivedBytes / totalBytes) * 100)
                            document.getElementById("label1").innerText = "Download File " + download + "%"
                        }).pipe(filestream).on("error", (err) => {
                            filestream.close()
                            clearInterval(loop1)
                            document.getElementById("label1").innerText = "Error to Download File"
                            sweet2.fire({
                                icon: "error",
                                text: String(err),
                                showClass: {
                                    popup: 'animate__animated animate__fadeInDown'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutUp'
                                }
                            })
                        })

                        filestream.on("finish", () => {
                            filestream.close()
                            clearInterval(loop1)
                            document.getElementById("img1").src = "img/svg/check.svg"
                            document.getElementById("label1").innerText = "Download File!"
                            createbasicfile(2)
                        })

                        filestream.on("error", (err) => {
                            filestream.close()
                            clearInterval(loop1)
                            document.getElementById("label1").innerText = "Error to Download File"
                            sweet2.fire({
                                icon: "error",
                                text: String(err),
                                showClass: {
                                    popup: 'animate__animated animate__fadeInDown'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutUp'
                                }
                            })
                        })
                    }catch (err) {
                        filestream.close()
                        clearInterval(loop1)
                        document.getElementById("label1").innerText = "Error to Download File"
                        sweet2.fire({
                            icon: "error",
                            text: String(err),
                            showClass: {
                                popup: 'animate__animated animate__fadeInDown'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutUp'
                            }
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
                }else if (data[7] == types.PURPURMC) {
                    function_download("https://purpur.pl3x.net/api/v1/purpur/" + data[3] + "/latest/download")
                }else if (data[7] == types.YATOPIA) {
                    function_download("https://api.yatopiamc.org/v2/latestBuild/download?branch=ver/" + data[3])
                }else {
                    sweet2.fire({
                        icon: "error",
                        text: "Unknown Type",
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        }
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
    homepage.classList.remove("link-dark")
    homepage.classList.add("link-secondary")
    document.getElementById("setuppage").classList.remove("link-dark")
    document.getElementById("setuppage").classList.add("link-secondary")
}
const request = require("request")
const file = require("fs")
const path = require("path")
const yauzl = require("yauzl")
const {  } = require("child_process")
const stringify = require("json-stringify-pretty-compact")
const localpath = document.getElementById("localpath")
const pathbutton = document.getElementById("pathbutton")
const ngrok = document.getElementById("ngrok")
const ngrokfolder = document.getElementById("ngrokfolder")
const checkimg = "img/svg/check.svg"
const pending = "Pending"
const img0 = document.getElementById("img0")
const label0 = document.getElementById("label0")
let buttonlock = false
let ___dirname = __dirname

if (___dirname.endsWith("\\app.asar\\build")) {
    ___dirname = __dirname.replace("\\app.asar\\build", "")
}

localpath.value = ___dirname

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

ngrok.addEventListener("click", () => {
    if (!buttonlock) {
        img0.style.opacity = 1
        label0.innerText = pending
        file.mkdir(path.join(___dirname, "ngrok"), (err) => {
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
                img0.style.opacity = 0
                label0.innerText = ""
                return
            }
            label0.innerText = "Check OS"
            switch (process.platform) {
                case "win32":
                    switch (process.arch) {
                        case "x64":
                            download("Windows", "amd64")
                            break
                        case "x32":
                            download("Windows", "386")
                            break
                    }
                    break
                case "darwin":
                    switch (process.arch) {
                        case "x64":
                            download("Mac OS", "amd64")
                            break
                        case "arm64":
                            download("Mac OS", "arm64")
                            break
                    }
                    break
                case "linux":
                    switch (process.arch) {
                        case "x64":
                            download("Linux", "amd64")
                            break
                        case "x32":
                            download("Linux", "386")
                            break
                        case "arm64":
                            download("Linux", "arm64")
                            break
                        case "arm":
                            download("Linux", "arm")
                            break
                    }
                    break
                default:
                    img0.style.opacity = 0
                    label0.innerText = ""
                    break
            }
        })
    }
})

ngrokfolder.addEventListener("click", () => {
    if (!buttonlock) {
        buttonlock = true
        img0.style.opacity = 1
        label0.innerText = pending
        try {
            label0.innerText = "Check File"
            const statfile = file.statSync(path.join(___dirname, "ngrok"))
            if (statfile.isDirectory()) {
                label0.innerText = "Check Ngrok File"
                const statfile = file.statSync(path.join(___dirname, "ngrok", process.platform == "win32" ? "ngrok.exe" : "ngrok"))
                if (statfile.isFile()) {
                    label0.innerText = "Check Config File"
                    const readConfig = () => {
                        const configfile = file.statSync(path.join(___dirname, "ngrok", "ngrok.xyzerconfig"))
                        if (configfile.isFile()) {
                            label0.innerText = "Read Config File"
                            file.readFile(path.join(___dirname, "ngrok", "ngrok.xyzerconfig"), (err, buffer) => {
                                let configjson = JSON.parse(buffer.toString())
                                if (configjson.count != undefined && configfile.count != "undefined") {
                                    if (typeof configfile.count == "number") {
                                        const numbercount = Number(configfile.count)
                                        if (numbercount == 0) {
                                            img0.src = checkimg
                                            label0.innerText = "Set Folder Ngrok!"
                                            buttonlock = true
                                            document.getElementById("ngrokbox").style.opacity = 0
                                            document.getElementById("ngrokbox").style.display = "none"
                                        }
                                    } else {
                                        ngrok.style.opacity = 1
                                        sweet2.fire({
                                            icon: "error",
                                            text: path.join(___dirname, "ngrok", "ngrok.xyzerconfig") + " variable count isn't number",
                                            showClass: {
                                                popup: 'animate__animated animate__fadeInDown'
                                            },
                                            hideClass: {
                                                popup: 'animate__animated animate__fadeOutUp'
                                            }
                                        })
                                        img0.style.opacity = 0
                                        label0.innerText = ""
                                        buttonlock = false
                                    }
                                } else {
                                    ngrok.style.opacity = 1
                                    sweet2.fire({
                                        icon: "error",
                                        text: path.join(___dirname, "ngrok", "ngrok.xyzerconfig") + " doesn't have count variable",
                                        showClass: {
                                            popup: 'animate__animated animate__fadeInDown'
                                        },
                                        hideClass: {
                                            popup: 'animate__animated animate__fadeOutUp'
                                        }
                                    })
                                    img0.style.opacity = 0
                                    label0.innerText = ""
                                    buttonlock = false
                                }
                            })
                        } else if (configfile.isDirectory()) {
                            ngrok.style.opacity = 1
                            sweet2.fire({
                                icon: "error",
                                text: path.join(___dirname, "ngrok", "ngrok.xyzerconfig") + " isn't File!",
                                showClass: {
                                    popup: 'animate__animated animate__fadeInDown'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutUp'
                                }
                            })
                            img0.style.opacity = 0
                            label0.innerText = ""
                            buttonlock = false
                        }
                    }
                    try {
                        file.statSync(path.join(___dirname, "ngrok", "ngrok.xyzerconfig"))
                        setTimeout(readConfig, 10000)
                    } catch (err) {
                        file.writeFile(path.join(___dirname, "ngrok", "ngrok.xyzerconfig"), stringify({
                            "count": 0
                        }), (err) => {
                            if (err) {
                                ngrok.style.opacity = 1
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
                                img0.style.opacity = 0
                                label0.innerText = ""
                                buttonlock = false
                            }
                        })
                        setTimeout(readConfig, 10000)
                    }
                } else {
                    ngrok.style.opacity = 1
                    sweet2.fire({
                        icon: "error",
                        text: path.join(___dirname, "ngrok", process.platform == "win32" ? "ngrok.exe" : "ngrok") + " isn't File!",
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        }
                    })
                    img0.style.opacity = 0
                    label0.innerText = ""
                    buttonlock = false
                }
            } else {
                ngrok.style.opacity = 1
                sweet2.fire({
                    icon: "error",
                    text: path.join(___dirname, "ngrok") + " isn't Directory!",
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                })
                img0.style.opacity = 0
                label0.innerText = ""
                buttonlock = false
            }
        } catch (err) {
            ngrok.style.opacity = 1
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
            img0.style.opacity = 0
            label0.innerText = ""
            buttonlock = false
        }
    }
})

function download(type, arch) {
    buttonlock = true
    label0.innerText = "Get API"
    fetch("https://ngrok.com/download").then((res) => {return res.text()}).then((data) => {
        const xml = new DOMParser().parseFromString(data, "text/html")
        const list0 = xml.getElementsByClassName("download-hero")[0].getElementsByClassName("mycontain")[0].getElementsByClassName("download-dropdown w-dropdown-list")[0].getElementsByClassName("w-col w-col-3")
        for (let array0 = 0; array0 < list0.length; array0++) {
            if (list0[array0].getElementsByTagName("b")[0].textContent == type) {
                const list1 = list0[array0].getElementsByTagName("a")
                switch (process.platform) {
                    case "linux":
                        switch (arch) {
                            case "arm":
                                for (let array1 = 0; array1 < list1.length; array1++) {
                                    if (list1[array1].id.endsWith("arm") && list1[array1].textContent.includes("Linux (ARM)")) {
                                        DownloadFile(list1[array1].href)
                                    }
                                }
                                break
                            case "arm64":
                                for (let array1 = 0; array1 < list1.length; array1++) {
                                    if (list1[array1].id.endsWith("arm") && list1[array1].textContent.includes("Linux (ARM64)")) {
                                        DownloadFile(list1[array1].href)
                                    }
                                }
                                break
                            default:
                                for (let array1 = 0; array1 < list1.length; array1++) {
                                    if (list1[array1].id.endsWith(arch)) {
                                        DownloadFile(list1[array1].href)
                                    }
                                }
                                break
                        }
                        break
                    default:
                        for (let array1 = 0; array1 < list1.length; array1++) {
                            if (list1[array1].id.endsWith(arch)) {
                                DownloadFile(list1[array1].href)
                            }
                        }
                        break
                }
            }
        }
    })
}

function DownloadFile(zipurl) {
    label0.innerText = "Download File"
    const urlname = String(zipurl).split("/")
    const fileurl = path.join(___dirname, "ngrok", urlname[urlname.length - 1])
    const filestream = file.createWriteStream(fileurl)
    let totalBytes = 0
    let receivedBytes = 0
    try {
        request.get(zipurl).on("response", (res) => {
            if (res.statusCode != 200) {
                filestream.close()
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
                img0.style.opacity = 0
                label0.innerText = ""
                buttonlock = false
                return
            }
            totalBytes = res.headers["content-length"]
        }).on("data", (chunk) => {
            receivedBytes += chunk.length
            download = Math.floor((receivedBytes / totalBytes) * 100)
            label0.innerText = "Download " + download + "%"
        }).pipe(filestream).on("error", (err) => {
            filestream.close()
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
            img0.style.opacity = 0
            label0.innerText = ""
            buttonlock = false
        })

        filestream.on("finish", () => {
            filestream.close()
            sweet2.fire({
                icon: "success",
                text: "Download ngrok!",
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
            unzipngrok(fileurl)
        })

        filestream.on("error", (err) => {
            filestream.close()
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
            img0.style.opacity = 0
            label0.innerText = ""
            buttonlock = false
        })
    }catch (err) {
        filestream.close()
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
        img0.style.opacity = 0
        label0.innerText = ""
        buttonlock = false
    }
}

function unzipngrok(urlfile) {
    label0.innerText = "Unzip ngrok"
    yauzl.open(urlfile, {
        lazyEntries: true
    }, (err, zipfile) => {
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
            buttonlock = false
            return
        }
        zipfile.readEntry()
        zipfile.on("entry", (entry) => {
            if (!(/\/$/.test(entry.fileName))) {
                const filestream = file.createWriteStream(path.join(___dirname, "ngrok", entry.fileName))
                zipfile.openReadStream(entry, (err, readStream) => {
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
                        buttonlock = false
                        return
                    }
                    readStream.on("end", () => {
                        zipfile.readEntry()
                    })
                    readStream.pipe(filestream)
                })
            }
        })
    })
    try {
        label0.innerText = "Clean up"
        file.unlinkSync(urlfile)
        img0.src = checkimg
        label0.innerText = "Download ngrok!"
        ngrok.style.opacity = 0
        buttonlock = false
    } catch (err) {
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
        buttonlock = false
    }
}
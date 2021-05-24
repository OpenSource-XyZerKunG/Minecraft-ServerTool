
const https = require("https")
const file = require("fs")
const path = require("path")
const localpath = document.getElementById("localpath")
const pathbutton = document.getElementById("pathbutton")
const ngrok = document.getElementById("ngrok")
const ngrokfolder = document.getElementById("ngrokfolder")
let ___dirname = __dirname

if (___dirname.endsWith("\\app.asar\\build")) {
    ___dirname = __dirname.replace("\\app.asar\\build", "")
}

localpath.value = path.join(___dirname, "ngrok")

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
            return
        }
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
        }
    })
})

ngrokfolder.addEventListener("click", () => {

})

function download(type, arch) {
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
    const urlname = String(zipurl).split("/")
    const filestream = file.createWriteStream(path.join(___dirname, "ngrok", urlname[urlname.length - 1]))
    https.get(zipurl, (res) => {
        res.pipe(filestream)
    }).on("error", (err) => {
        filestream.close()
    })
    filestream.on("finish", () => {
        filestream.close()
    })
}
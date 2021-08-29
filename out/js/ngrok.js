const path = require("path")
const file = require("fs")
const stringify = require("json-stringify-pretty-compact")

const ngrokbox = document.getElementById("ngrokbox")
const ngrokdisplay = document.getElementById("ngrokdisplay")
const ngrokfolder = document.getElementById("ngrokfolder")
const localpath = document.getElementById("localpath")
const pathbutton = document.getElementById("pathbutton")
const img0 = document.getElementById("img0")
const label0 = document.getElementById("label0")
const spinimg = "img/svg/spin.svg"

let ___dirname = __dirname
let ngroktoken = ""
let ngrokregion = ""
let buttonlock = false
let issetup = false

if (___dirname.endsWith("\\app.asar\\out")) {
    ___dirname = __dirname.replace("\\app.asar\\out", "")
}

localpath.value = ___dirname

ipcRenderer.on("post:choosebox", (event, message) => {
    localpath.value = message
})

pathbutton.addEventListener("click", () => {
    ipcRenderer.send("post:app", "get:choosebox")
})

ngrokfolder.addEventListener("click", () => {
    if (!buttonlock) {
        img0.src = spinimg
        buttonlock = true
        img0.style.opacity = 1
        let intloop0 = 0
        let stringloop0 = "Pending"
        label0.innerText = "Pending"
        const loop0 = setInterval(() => {
            switch (intloop0) {
                case 0:
                    label0.innerText = `${stringloop0}.`
                    break
                case 1:
                    label0.innerText = `${stringloop0}..`
                    break
                case 2:
                    label0.innerText = `${stringloop0}...`
                    break
                case 3:
                    label0.innerText = `${stringloop0}`
                    intloop0 = -1
                    break
            }
            intloop0++
        }, 1000)
        try {
            intloop0 = 0
            stringloop0 = "Check File"
            const statfile = file.statSync(path.join(___dirname))
            if (statfile.isDirectory()) {
                intloop0 = 0
                stringloop0 = "Check Config"
                const finishtokenfunction = () => {
                    sweet2.fire({
                        icon: "success",
                        text: "Setup ngrok",
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        }
                    })
                    clearInterval(loop0)
                    label0.innerText = ""
                    ngrokbox.style.display = "none"
                    ngrokdisplay.style.opacity = 1
                    issetup = true
                }
                try {
                    intloop0 = 0
                    stringloop0 = "Check Config"
                    file.statSync(path.join(___dirname, "ngrok.xyzerconfig"))
                    intloop0 = 0
                    stringloop0 = "Read Config"
                    file.readFile(path.join(___dirname, "ngrok.xyzerconfig"), (err, data) => {
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
                            img0.style.opacity = 0
                            clearInterval(loop0)
                            label0.innerText = ""
                            buttonlock = false
                            return
                        }
                        const jsondata = JSON.parse(data)
                        if (Number(jsondata.version) == 1000) {
                            ngroktoken = jsondata.authtoken
                            ngrokregion = jsondata.region
                            finishtokenfunction()
                        } else {
                            sweet2.fire({
                                icon: "error",
                                text: "The version configuration is not equal to 1000",
                                showClass: {
                                    popup: 'animate__animated animate__fadeInDown'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__fadeOutUp'
                                }
                            })
                            img0.style.opacity = 0
                            clearInterval(loop0)
                            label0.innerText = ""
                            buttonlock = false
                        }
                    })
                } catch (err) {
                    const tokenfunction = () => {
                        sweet2.fire({
                            icon: "question",
                            text: "Connect your account using ngrok token",
                            input: "password",
                            inputAttributes: {
                                autocapitalize: 'off'
                            },
                            showCancelButton: false,
                            confirmButtonText: "Apply",
                            showLoaderOnConfirm: true,
                            allowOutsideClick: () => !sweet2.isLoading()
                        }).then((result) => {
                            if (result.isConfirmed) {
                                if (!String(result.value).replaceAll(" ", "") == "") {
                                    ngroktoken = String(result.value)
                                    ngrokregion = "ap"
                                    file.writeFile(path.join(___dirname, "ngrok.xyzerconfig"), stringify({
                                        "authtoken": ngroktoken,
                                        "region": "ap",
                                        "version": "1000"
                                    }), (err) => {
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
                                            img0.style.opacity = 0
                                            clearInterval(loop0)
                                            label0.innerText = ""
                                            buttonlock = false
                                        }
                                    })
                                    finishtokenfunction()
                                } else {
                                    tokenfunction()
                                }
                            } else {
                                tokenfunction()
                            }
                        })
                    }
                    tokenfunction()
                }
            } else {
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
                clearInterval(loop0)
                label0.innerText = ""
                buttonlock = false
            }
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
            img0.style.opacity = 0
            clearInterval(loop0)
            label0.innerText = ""
            buttonlock = false
        }
    }
})

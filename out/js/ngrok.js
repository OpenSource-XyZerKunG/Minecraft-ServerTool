const path = require("path")
const file = require("fs")
const stringify = require("json-stringify-pretty-compact")
const bcrypt = require("bcrypt")
const aes = require("aes256")

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
                        if (Number(jsondata.version) == 1010) {
                            ngrokregion = jsondata.region
                            if (jsondata.encrypt) {
                                const passwordFunction = () => {
                                    sweet2.fire({
                                        icon: "question",
                                        text: "This token is encrypted. Please enter your password to decrypt!",
                                        input: "password",
                                        inputAttributes: {
                                            autocapitalize: "off"
                                        },
                                        showCancelButton: false,
                                        confirmButtonText: "Apply",
                                        showLoaderOnConfirm: true,
                                        allowOutsideClick: () => !sweet2.isLoading()
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            if (!String(result.value).replaceAll(" ", "") == "" && result.value != undefined) {
                                                ngroktoken = aes.decrypt(result.value, aes.decrypt(result.value, Buffer.from(jsondata.authtoken, "base64").toString("utf8")).split("::::::")[0])
                                                finishtokenfunction()
                                            } else {
                                                passwordFunction()
                                            }
                                        } else {
                                            passwordFunction()
                                        }
                                    })
                                }
                                passwordFunction()
                            } else {
                                ngroktoken = jsondata.authtoken
                                finishtokenfunction()
                            }
                        } else {
                            sweet2.fire({
                                icon: "error",
                                text: "This config file is old version. Please delete this file and try to create a new one.",
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
                            showCancelButton: true,
                            confirmButtonText: "Encrypt Token",
                            cancelButtonText: "Not now!",
                            showLoaderOnConfirm: true,
                            allowOutsideClick: () => !sweet2.isLoading()
                        }).then((result) => {
                            if (result.isConfirmed) {
                                if (!String(result.value).replaceAll(" ", "") == "" && result.value != undefined) {
                                    const passwordFunction = async () => {
                                        sweet2.fire({
                                            icon: "question",
                                            text: "Enter your password",
                                            input: "password",
                                            inputAttributes: {
                                                autocapitalize: "off"
                                            },
                                            showCancelButton: true,
                                            confirmButtonText: "Done",
                                            cancelButtonText: "Back",
                                            showLoaderOnConfirm: true,
                                            reverseButtons: true,
                                            allowOutsideClick: () => !sweet2.isLoading()
                                        }).then(async (passresult) => {
                                            if (passresult.isConfirmed) {
                                                if (!String(passresult.value).replaceAll(" ", "") == "" && passresult.value != undefined) {
                                                    try {
                                                        const salt = await bcrypt.genSalt()
                                                        const encryptToken = Buffer.from(aes.encrypt(passresult.value, aes.encrypt(passresult.value, result.value) + "::::::" + salt), "utf8").toString("base64")
                                                        ngroktoken = String(result.value)
                                                        ngrokregion = "ap"
                                                        file.writeFile(path.join(___dirname, "ngrok.xyzerconfig"), stringify({
                                                            "authtoken": encryptToken,
                                                            "region": "ap",
                                                            "encrypt": true,
                                                            "version": "1010"
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
                                                } else {
                                                    passwordFunction()
                                                }
                                            } else {
                                                tokenfunction()
                                            }
                                        })
                                    }
                                    passwordFunction()
                                } else {
                                    tokenfunction()
                                }
                            } else {
                                if (!String(result.value).replaceAll(" ", "") == "" && result.value != undefined && result.value != undefined) {
                                    ngroktoken = String(result.value)
                                    ngrokregion = "ap"
                                    file.writeFile(path.join(___dirname, "ngrok.xyzerconfig"), stringify({
                                        "authtoken": ngroktoken,
                                        "region": "ap",
                                        "encrypt": false,
                                        "version": "1010"
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

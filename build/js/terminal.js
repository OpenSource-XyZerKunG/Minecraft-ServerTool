const { Terminal } = require("xterm")
const { WebLinksAddon } = require("xterm-addon-web-links")
const { FitAddon } = require("xterm-addon-fit")
const { Unicode11Addon } = require("xterm-addon-unicode11")
const fitAddon = new FitAddon()
const unicodeAddon = new Unicode11Addon()
const term = new Terminal()
const terminal = document.getElementById("terminal")
const terminalname = document.getElementById("terminalname")

term.loadAddon(unicodeAddon)
term.loadAddon(new WebLinksAddon())
term.loadAddon(fitAddon)
fitAddon.fit()
term.unicode.activeVersion = "11"
term.open(terminal)

ipcRenderer.on("terminal.incomingData", (event, data) => {
    term.write(data)
})

term.onData(e => {
    ipcRenderer.send("terminal.keystroke", e)
})

ipcRenderer.on("post:terminalname", (event, data) => {
    if (String(data.name).replaceAll(" ", "") != "") {
        terminalname.innerText = data.name
        document.getElementById("ngrokhidebox").style.opacity = 1
        const scriptngrok = document.createElement("script")
        scriptngrok.src = "js/ngrok.js"
        document.body.appendChild(scriptngrok)
    }
    let dataexecute = String(data.execute)
    if (dataexecute.replaceAll(" ", "") != "") {
        for (intexecute in dataexecute) {
            ipcRenderer.send("terminal.keystroke", dataexecute[intexecute])
        }
        ipcRenderer.send("terminal.keystroke", "\r")
    } else {
        ipcRenderer.send("terminal.keystroke", "\r")
    }
})

window.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("post:app", "get:terminalname")
})

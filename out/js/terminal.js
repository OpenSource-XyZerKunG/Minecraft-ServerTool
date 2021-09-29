const os = require("os")
const { Terminal } = require("xterm")
const { WebLinksAddon } = require("xterm-addon-web-links")
const { FitAddon } = require("xterm-addon-fit")
const { Unicode11Addon } = require("xterm-addon-unicode11")
const fitAddon = new FitAddon()
const unicodeAddon = new Unicode11Addon()
const term = new Terminal()
const terminal = document.getElementById("terminal")
const terminalname = document.getElementById("terminalname")

let pty
try {
    pty = require("node-pty");
} catch (outerError) {
    console.error("outerError", outerError);
}

const shell = os.platform == "win32" ? "powershell.exe" : "bash"
const ptyProcess = pty.spawn(shell, [], {
  name: "servertool-terminal",
  cols: 80,
  rows: 30,
  cwd: os.homedir(),
  env: process.env,
})

term.loadAddon(unicodeAddon)
term.loadAddon(new WebLinksAddon())
term.loadAddon(fitAddon)
fitAddon.fit()
term.unicode.activeVersion = "11"
term.open(terminal)

term.onData(data => ptyProcess.write(data))

ptyProcess.on("data", (data) => {
    term.write(data)
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
            ptyProcess.write(dataexecute[intexecute])
        }
        ptyProcess.write("\r")
    } else {
        ptyProcess.write("\r")
    }
    
})

window.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("post:app", "get:terminalname")
})
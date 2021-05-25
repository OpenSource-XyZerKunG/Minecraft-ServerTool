const { Terminal } = require("xterm")
const { WebLinksAddon } = require("xterm-addon-web-links")
const { FitAddon } = require("xterm-addon-fit")
const fitAddon = new FitAddon()
const term = new Terminal()
const terminal = document.getElementById("terminal")

term.loadAddon(new WebLinksAddon())
term.loadAddon(fitAddon)
fitAddon.fit()
term.open(terminal)
ipcRenderer.send("terminal.keystroke", "\r")

ipcRenderer.on("terminal.incomingData", (event, data) => {
    term.write(data)
})

term.onData(e => {
    ipcRenderer.send("terminal.keystroke", e)
})

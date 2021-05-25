const { Terminal } = require("xterm")
const { WebLinksAddon } = require("xterm-addon-web-links")
const { FitAddon } = require("xterm-addon-fit")
const { Unicode11Addon } = require("xterm-addon-unicode11")
const fitAddon = new FitAddon()
const unicodeAddon = new Unicode11Addon()
const term = new Terminal()
const terminal = document.getElementById("terminal")

term.loadAddon(unicodeAddon)
term.loadAddon(new WebLinksAddon())
term.loadAddon(fitAddon)
fitAddon.fit()
term.unicode.activeVersion = "11"
term.open(terminal)
ipcRenderer.send("terminal.keystroke", "\r")

ipcRenderer.on("terminal.incomingData", (event, data) => {
    term.write(data)
})

term.onData(e => {
    ipcRenderer.send("terminal.keystroke", e)
})

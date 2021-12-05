import os from "os"
import { Terminal } from "xterm"
import { WebLinksAddon } from "xterm-addon-web-links"
import { FitAddon } from "xterm-addon-fit"
import { Unicode11Addon } from "xterm-addon-unicode11"

import * as ipcChannelPIPE from "../pipe/ipcChannel"
import { GET, GLOBAL } from "../pipe/tempDB"
import { TerminalConfig } from "../pipe/terminal"

function NodePTY() {
    try {
        return require("node-pty");
    } catch (outerError) {
        console.error("Failed to load terminal module", outerError)
    }
}

async function loadTerminal() {
    const tempDBParm: GET = { "path": GLOBAL.TERMINALCONFIG }

    const terminalConfig: TerminalConfig | undefined = await global.ipcRenderer.invoke(ipcChannelPIPE.MAIN.TEMPDB_GET, tempDBParm)
    
    const pty = NodePTY()
    const fitAddon = new FitAddon()
    const unicodeAddon = new Unicode11Addon()
    const term = new Terminal()
    const terminal = document.getElementById("terminal")
    const terminalname = document.getElementById("terminalname")

    const shell = os.platform() === "win32" ? "powershell.exe" : "bash"
    const ptyProcess = pty.spawn(shell, [], {
        name: "servertool-terminal",
        cols: 160,
        rows: 60,
        cwd: terminalConfig?.cd ? terminalConfig.cd : os.homedir(),
        env: process.env,
    })

    term.loadAddon(unicodeAddon)
    term.loadAddon(new WebLinksAddon())
    term.loadAddon(fitAddon)

    if (terminalname) terminalname.innerText = terminalConfig ? terminalConfig.title : "ServerTool Terminal (No Config)"

    if (terminalConfig) ptyProcess.write(`${terminalConfig.execute}\r`)

    if (terminal) term.open(terminal)

    fitAddon.fit()

    term.onData((data) => ptyProcess.write(data))
    ptyProcess.on("data", (data) => term.write(data))
}

loadTerminal()
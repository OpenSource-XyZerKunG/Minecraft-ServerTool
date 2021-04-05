const { ipcMain } = require("electron");
const main = ipcMain

window.addEventListener('DOMContentLoaded', () => {
    ipc.send("Ready! ? setup")
});

main.on('async-message', (event, arg) => {
    if (arg.startsWith("id0")) {
        let args = arg.split(":")
        switch (arg[1]) {
            case "origin":
                break
            case "snapshot":
                break
            case "paper":
                break
            case "bukkit":
                break
            default:
                ipc.sendSync("async-message", "index")
                break
        }
    }
})
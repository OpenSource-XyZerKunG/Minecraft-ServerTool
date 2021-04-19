window.addEventListener('DOMContentLoaded', () => {
    ipc.send("async-message", "ready:setup")
    ipcMain.on("async-message", (event, arg) => {
        
    })
});
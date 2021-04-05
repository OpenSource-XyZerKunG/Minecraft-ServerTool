const { ipcRenderer } = require('electron')
const ipc = ipcRenderer
const min = document.getElementById('min')
const full = document.getElementById('full')
const close = document.getElementById('close')

min.addEventListener('mouseenter', () => {
    min.src = "img/svg/dash-square-fill.svg"
})

min.addEventListener('mouseout', () => {
    min.src = "img/svg/dash-square.svg"
})

full.addEventListener('mouseenter', () => {
    full.src = "img/svg/square-fill.svg"
})

full.addEventListener('mouseout', () => {
    full.src = "img/svg/square.svg"
})

close.addEventListener('mouseenter', () => {
    close.src = "img/svg/x-circle-fill.svg"
})

close.addEventListener('mouseout', () => {
    close.src = "img/svg/x-circle.svg"
})

min.addEventListener('click', () => {
    ipc.sendSync("async-message", "*e^Q$xV?z>6[$X@9")
})

full.addEventListener('click', () => {
    ipc.sendSync("async-message", "A%Q3,BUNbw6Sxjtw")
})

close.addEventListener('click', () => {
    ipc.sendSync("async-message", "X=E[8}N&L;j6nN}9")
})
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var vars = require("./var");
var ui = null;
var http = require("http").createServer();
var socket = require("socket.io")(http);
function createsocket() {
    socket.on("connection", function (client) {
        if (client.handshake.address != "::ffff:127.0.0.1") {
            client.destroy;
        }
        else {
            console.log("UI Connect!");
            client.on("post:app", function (message) {
                switch (message) {
                    case "get:all":
                        client.emit("post:all", vars.title + ":don'ttypethis:(:" + vars.folder + ":don'ttypethis:(:" + vars.envvar + ":don'ttypethis:(:" + vars.version + ":don'ttypethis:(:" + vars.nogui + ":don'ttypethis:(:" + vars.eula + ":don'ttypethis:(:" + vars.autorun + ":don'ttypethis:(:");
                        break;
                    case "get:type":
                        client.emit("post:type", String(vars.type));
                        break;
                    case "*e^Q$xV?z>6[$X@9":
                        ui.minimize();
                        break;
                    case "A%Q3,BUNbw6Sxjtw":
                        if (!ui.isMaximized()) {
                            ui.maximize();
                        }
                        else {
                            ui.unmaximize();
                        }
                        break;
                    case "X=E[8}N&L;j6nN}9":
                        ui.close();
                        break;
                }
            });
            client.on("post:type", function (message) {
                vars.type = String(message);
                console.log("TYPE: " + vars.type);
            });
            client.on("post:data", function (message) {
                var data = String(message).split(":don'ttypethis:(:");
                vars.title = data[0];
                vars.folder = data[1];
                vars.envvar = data[2];
                vars.version = data[3];
                vars.nogui = data[4];
                vars.eula = data[5];
                vars.autorun = data[6];
                console.log("Console Title: " + vars.title);
                console.log("Folder Name: " + vars.folder);
                console.log("Environment Variable: " + vars.envvar);
                console.log("Version: " + vars.version);
                console.log("NoGUI: " + vars.nogui);
                console.log("Eula: " + vars.eula);
                console.log("AutoRun: " + vars.autorun);
            });
        }
    });
    http.listen(45785, function () {
        console.log("Wait for UI..");
    });
}
function createWindow() {
    createsocket();
    ui = new electron_1.BrowserWindow({
        "title": "ServerTool",
        "icon": path.join(__dirname, "img/terminal.png"),
        "frame": false,
        "webPreferences": {
            "nodeIntegration": true,
            "contextIsolation": false
        },
        "minWidth": 800,
        "minHeight": 480,
        "show": false
    });
    ui.once("ready-to-show", function () {
        ui.show();
        ui.webContents.openDevTools();
    });
    ui.loadURL(url.format({
        "pathname": path.join(__dirname, "select.html"),
        "protocol": "file:",
        "slashes": true
    }));
    electron_1.Menu.setApplicationMenu(new electron_1.Menu());
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform != "darwin") {
        electron_1.app.quit();
    }
});

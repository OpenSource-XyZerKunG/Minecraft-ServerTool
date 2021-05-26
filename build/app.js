"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var axios_1 = __importDefault(require("axios"));
var path_1 = __importDefault(require("path"));
var url_1 = __importDefault(require("url"));
var fs_1 = __importDefault(require("fs"));
var pty = require("node-pty");
var vars = require("./var");
var ui = null;
var shell = process.platform == "win32" ? "powershell.exe" : "bash";
var ptyProcess = pty.spawn(shell, [], {
    "name": "xterm-color",
    "cols": 80,
    "rows": 30,
    "cwd": electron_1.app.getPath("desktop"),
    "env": process.env
});
function createsocket() {
    var _this = this;
    electron_1.ipcMain.on("post:app", function (event, message) {
        switch (message) {
            case "spigottool":
                var toolfile_1 = fs_1.default.createWriteStream(path_1.default.join(vars.path, vars.folder, "spigottool.jar"));
                var functionaxios = function () { return __awaiter(_this, void 0, void 0, function () {
                    var res, totalBytes, receivedBytes;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, axios_1.default({
                                    url: "https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar",
                                    method: 'GET',
                                    responseType: 'stream'
                                })];
                            case 1:
                                res = _a.sent();
                                totalBytes = res.headers["content-length"];
                                receivedBytes = 0;
                                res.data.on("data", function (chunk) {
                                    receivedBytes += chunk.length;
                                    event.reply("statustool", Math.floor((receivedBytes / totalBytes) * 100));
                                });
                                res.data.pipe(toolfile_1);
                                return [2];
                        }
                    });
                }); };
                functionaxios();
                break;
            case "get:all":
                event.reply("post:all", vars.title + ":don'ttypethis:(:" + vars.folder + ":don'ttypethis:(:" + vars.envvar + ":don'ttypethis:(:" + vars.version + ":don'ttypethis:(:" + vars.nogui + ":don'ttypethis:(:" + vars.eula + ":don'ttypethis:(:" + vars.autorun + ":don'ttypethis:(:" + vars.type + ":don'ttypethis:(:" + vars.path);
                break;
            case "get:type":
                event.reply("post:type", String(vars.type));
                break;
            case "get:desktop":
                event.reply("post:desktop", electron_1.app.getPath("desktop"));
                break;
            case "get:choosebox":
                electron_1.dialog.showOpenDialog(ui, {
                    "defaultPath": electron_1.app.getPath("desktop"),
                    "properties": ["openDirectory", "createDirectory"]
                }).then(function (data) {
                    if (!data.canceled) {
                        event.reply("post:choosebox", data.filePaths);
                    }
                });
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
    electron_1.ipcMain.on("post:type", function (event, message) {
        vars.type = String(message);
        console.log("TYPE: " + vars.type);
    });
    electron_1.ipcMain.on("post:data", function (event, message) {
        var data = String(message).split(":don'ttypethis:(:");
        vars.title = data[0];
        vars.folder = data[1];
        vars.envvar = data[2];
        vars.version = data[3];
        vars.nogui = data[4];
        vars.eula = data[5];
        vars.autorun = data[6];
        vars.path = data[7];
        console.log("Console Title: " + vars.title);
        console.log("Folder Name: " + vars.folder);
        console.log("Environment Variable: " + vars.envvar);
        console.log("Version: " + vars.version);
        console.log("NoGUI: " + vars.nogui);
        console.log("Eula: " + vars.eula);
        console.log("AutoRun: " + vars.autorun);
        console.log("Dir: " + vars.path);
    });
    ptyProcess.on("data", function (data) {
        ui.webContents.send("terminal.incomingData", data);
    });
    electron_1.ipcMain.on("terminal.keystroke", function (event, key) {
        ptyProcess.write(key);
    });
}
function createWindow() {
    createsocket();
    ui = new electron_1.BrowserWindow({
        "title": "ServerTool",
        "icon": path_1.default.join(__dirname, "img/terminal.png"),
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
    ui.loadURL(url_1.default.format({
        "pathname": path_1.default.join(__dirname, "select.html"),
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

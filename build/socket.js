"use strict";
module.exports = function () {
    var http = require("http").createServer();
    var socket = require("socket.io")(http);
    socket.on("connection", function (client) {
        if (client.handshake.address != "::ffff:127.0.0.1") {
            client.destroy;
        }
        else {
            console.log("UI Connect!");
            client.on("post:app", function (message) {
                switch (message) {
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
        }
    });
    http.listen(45785, function () {
        console.log("Wait for UI..");
    });
};

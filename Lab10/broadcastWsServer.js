import {WebSocket, WebSocketServer} from "ws";

const wsserver =  new WebSocketServer({
    port: 4000,
    host: "localhost",
    path: "/broadcast"
});

wsserver.on("connection", (ws) => {
    ws.on("message", message => {
        wsserver.clients.forEach((client) => {
           if (client.readyState === WebSocket.OPEN)
               client.send("server: " + message);
        });
    });
});

wsserver.on("error", (e) => {
    console.log("WS server error ", e);
});

console.log(`WS server: host=${wsserver.options.host}, port=${wsserver.options.port}, path=${wsserver.options.path}`);
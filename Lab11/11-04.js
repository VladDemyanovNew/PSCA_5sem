import {WebSocket, WebSocketServer} from "ws";

const wsserver =  new WebSocketServer({
    port: 4000,
    host: "localhost",
    path: "/json"
});

let n = 0;

wsserver.on("connection", (ws) => {

    ws.on("message", (data) => {
        console.log("on message: ", data.toString());
        data = JSON.parse(data);
        data = {server: ++n, client: data.client, timestamp: new Date()};
        ws.send(JSON.stringify(data));
    });
});

wsserver.on("error", (e) => {
    console.log("WS server error ", e);
});

console.log(`WS server: host=${wsserver.options.host}, port=${wsserver.options.port}, path=${wsserver.options.path}`);
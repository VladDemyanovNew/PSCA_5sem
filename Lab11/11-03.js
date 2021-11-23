import {WebSocket, WebSocketServer} from "ws";

const wsserver =  new WebSocketServer({
    port: 4000,
    host: "localhost",
    path: "/broadcast"
});

let n = 0;

wsserver.on("connection", (ws) => {
    ws.on("pong", (data) => {
       console.log("on pong: ", data.toString());
    });

    ws.on("message", (data) => {
        console.log("on message: ", data.toString());
    });

    setInterval(() => {
        wsserver.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN)
                client.send(`11-03-server: ${++n}`);
        });
    }, 15000);

    setInterval(() => {
        console.log(`server: ping (clients count=${wsserver.clients.size})`);
        ws.ping("server: ping");
    }, 5000);
});

wsserver.on("error", (e) => {
    console.log("WS server error ", e);
});

console.log(`WS server: host=${wsserver.options.host}, port=${wsserver.options.port}, path=${wsserver.options.path}`);
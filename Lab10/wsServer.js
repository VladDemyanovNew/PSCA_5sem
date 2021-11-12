import {WebSocketServer} from "ws";

const wsserver =  new WebSocketServer({
    port: 4000,
    host: "localhost",
    path: "/wsserver"
});

wsserver.on("connection", (ws) => {
    let k = 0;
    let n = 0;
    ws.on("message", message => {
        n++;
        console.log(`Received message => ${message}`);
    });

    setInterval(() => {
        ws.send(`10-01-server: ${n}->${++k}`);
    }, 5000);
});

wsserver.on("error", (e) => {
    console.log("WS server error ", e);
});

console.log(`WS server: host=${wsserver.options.host}, port=${wsserver.options.port}, path=${wsserver.options.path}`);
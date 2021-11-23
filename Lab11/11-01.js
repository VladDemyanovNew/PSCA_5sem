import {createWebSocketStream, WebSocketServer} from "ws";
import fs from "fs";

const wsserver =  new WebSocketServer({
    port: 4000,
    host: "localhost"
});

let k = 0;

wsserver.on("connection", (ws) => {
    const duplex = createWebSocketStream(ws, {encoding: "utf8"});
    let wfile = fs.createWriteStream(`./upload/file${++k}.txt`);
    duplex.pipe(wfile);
});

wsserver.on("error", (e) => {
    console.log("WS server error ", e);
});

console.log(`WS server: host=${wsserver.options.host}, port=${wsserver.options.port}, path=${wsserver.options.path}`);
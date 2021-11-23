import {createWebSocketStream, WebSocketServer} from "ws";
import fs from "fs";

const wsserver =  new WebSocketServer({
    port: 4000,
    host: "localhost"
});

wsserver.on("connection", (ws) => {
    const duplex = createWebSocketStream(ws, {encoding: "utf8"});
    let rfile = fs.createReadStream(`./download/MyFileDownload.txt`);
    rfile.pipe(duplex);
});

wsserver.on("error", (e) => {
    console.log("WS server error ", e);
});

console.log(`WS server: host=${wsserver.options.host}, port=${wsserver.options.port}, path=${wsserver.options.path}`);
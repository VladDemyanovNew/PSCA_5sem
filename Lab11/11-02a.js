import {WebSocket, createWebSocketStream} from "ws";
import fs from "fs";

const ws = new WebSocket("ws://localhost:4000");
let k = 0;

ws.on("open", () => {
    const duplex = createWebSocketStream(ws, {encoding: "utf8"});
    let wfile = fs.createWriteStream(`./static/MyFile${++k}.txt`);
    duplex.pipe(wfile);
});

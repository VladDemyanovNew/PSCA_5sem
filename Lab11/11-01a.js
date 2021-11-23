import {WebSocket, createWebSocketStream} from "ws";
import fs from "fs";

const ws = new WebSocket("ws://localhost:4000");

ws.on("open", () => {
   const duplex = createWebSocketStream(ws, {encoding: "utf8"});
   let rfile = fs.createReadStream("./static/MyFile.txt");
   rfile.pipe(duplex);
});

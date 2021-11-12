import {WebSocket} from "ws";

let param2 = process.argv[2];
let prfx = (typeof param2 == "undefined") ? "A" : param2;
let n = 0;

const ws = new WebSocket("ws://localhost:4000/broadcast");

ws.on("open", () => {
    console.log("socket.open");
    let timerId = setInterval(() => {
        ws.send(`client: ${prfx}-${++n}`);
    }, 3000);

    setTimeout(() => {
        clearInterval(timerId);
        ws.close();
    }, 25000);
});

ws.onclose = (e) => {
    console.log("socket.onclose ", e);
};

ws.onmessage = (e) => {
    console.log("socket.onmessage ", e.data);
};

ws.onerror = (err) => {
    console.log("Error ", err.message);
};
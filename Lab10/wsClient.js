import {WebSocket} from "ws";

const ws = new WebSocket("ws://localhost:4000/wsserver");
let n = 0;

ws.on("open", () => {
    console.log("socket.open");
    let timerId = setInterval(() => {
        ws.send(`10-01-client: ${++n}`);
    }, 3000);

    setTimeout(() => {
        clearInterval(timerId);
        ws.close();
    }, 25000)
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
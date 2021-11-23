import {WebSocket} from "ws";

const ws = new WebSocket("ws://localhost:4000/json");

let clientName = (typeof process.argv[2] == "undefined") ? "A" : process.argv[2];

ws.on("open", () => {
    console.log("socket.open");
    setInterval(() => {
        ws.send(JSON.stringify({client: clientName, timestamp: new Date()}));
    }, 3000);
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
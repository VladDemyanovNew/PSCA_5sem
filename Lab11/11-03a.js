import {WebSocket} from "ws";

const ws = new WebSocket("ws://localhost:4000/broadcast");

ws.on("open", () => {
    console.log("socket.open");
});

ws.onclose = (e) => {
    console.log("socket.onclose ", e);
};

ws.onmessage = (e) => {
    console.log("socket.onmessage ", e.data);
};

ws.on("ping", (data) => {
   console.log("on ping: ", data.toString());
});

ws.onerror = (err) => {
    console.log("Error ", err.message);
};
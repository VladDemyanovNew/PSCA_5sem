import http from "http";

let options = {
    host: "localhost",
    path: "/task1",
    port: 3000,
    method: "GET"
}

const req = http.request(options, (res) => {
   console.log("response = ", res.statusCode);
   console.log("statusMessage = ", res.statusMessage);
   console.log("socket.remoteAddress = ", res.socket.remoteAddress);
   console.log("socket.remotePort = ", res.socket.remotePort);

   let data = "";
   res.on("data", (chunk) => {
       console.log("data body = ", data += chunk.toString("utf8"));
   });
   res.on("end", () => {
       console.log("end body = ", data);
   });
});

req.on("error", (e) => {
    console.log("error = ", e.message);
});

req.end();
import http from "http";
import query from "querystring";

let params = query.stringify({x: 3, y: 4});
let path = `/task2?${params}`;

let options = {
    host: "localhost",
    path: path,
    port: 3000,
    method: "GET"
}

const req = http.request(options, (res) => {
    console.log("response = ", res.statusCode);
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

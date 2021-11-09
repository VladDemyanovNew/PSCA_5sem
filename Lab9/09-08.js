import http from "http";
import fs from "fs";

const file = fs.createWriteStream("MyFile.txt");

let options = {
    host: "localhost",
    path: "/task8",
    port: 3000,
    method: "GET"
}

const req = http.request(options, (res) => {
    res.pipe(file);
    console.log("file has been received successfully");
});

req.on("error", (e) => {
    console.log("error = ", e.message);
});

req.end();
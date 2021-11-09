import http from "http";
import fs from "fs";

let bound = "smw60-smw60-smw60";
let body = `--${bound}\r\n`;
body += "Content-Disposition:form-data; name=\"file\"; filename=\"MyFile.jpg\"\r\n";
body += "Content-Type:application/octet-stream\r\n\r\n";

let options = {
    host: "localhost",
    path: "/task7",
    port: 3000,
    method: "POST",
    headers: {"Content-Type": "multipart/form-data; boundary="+bound}
}

const req = http.request(options, (res) => {
    console.log("response = ", res.statusCode);
    let data = "";
    res.on("data", (chunk) => {
        console.log(chunk);
    });
});

req.on("error", (e) => {
    console.log("error = ", e.message);
});

req.write(body);

let stream = new fs.ReadStream("static/MyFile.jpg");
stream.on("data", (chunk) => {
    req.write(chunk);
    console.log(Buffer.byteLength(chunk));
});
stream.on("end", () => {
    req.end(`\r\n--${bound}--\r\n`);
});

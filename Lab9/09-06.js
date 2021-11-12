import http from "http";
import fs from "fs";

let bound = "smw60-smw60-smw60";
let body = `--${bound}\r\n`;
    body += "Content-Disposition:form-data; name=\"file\"; filename=\"MyFile.txt\"\r\n";
    body += "Content-Type:text/plain\r\n\r\n";
    body += fs.readFileSync("static/MyFile.txt");
    body += `\r\n--${bound}--\r\n`;

let options = {
    host: "localhost",
    path: "/task6",
    port: 3000,
    method: "POST",
    headers: {"Content-Type": "multipart/form-data; boundary="+bound}
    //formData
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

req.end(body);

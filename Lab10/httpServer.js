import http from "http";
import url from "url";
import fs from "fs";

let server = http.createServer();

function writeHTTP400(req, resp) {
    resp.statusCode = 404;
    resp.statusMessage = "Resourse is not found";
    resp.end("<h1>Resourse is not found</h1>");
    console.log("Resourse is not found");
}

let http_handler = (req, resp) => {
    let path = url.parse(req.url).pathname;

    if (path === "/start") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                writeHTTP400(req, resp);
            } else {
                resp.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
                resp.end(data);
            }
        });

    } else
        writeHTTP400(req, resp);
};

server.listen(3000, "127.0.0.1", () => {console.log("server.listen(5000)")})
    .on("error", (e) => {console.log("server.listen(5000): error: ", e.code)})
    .on("request", http_handler);

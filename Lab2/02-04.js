import http from "http";
import fs from "fs";

http.createServer(function (req, resp) {
    if (req.url === "/xmlhttprequest") {
        fs.readFile("xmlhttprequest.html", function (err, data) {
            if (err) {
                resp.status = 404;
                resp.end("Resourse not found");
            } else {
                resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                resp.end(data);
            }
        });
    } else if (req.url === "/api/name") {
        resp.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
        resp.end("Демьянов Владислав Русланович");
    } else {
        resp.status = 404;
        resp.end("Resourse not found", "utf-8");
    }
}).listen(3000, ()=>console.log("Server started at 3000"));
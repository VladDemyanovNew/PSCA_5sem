import http from "http";
import fs from "fs";

http.createServer(function (req, resp) {
    if (req.url === "/html") {
        fs.readFile("index.html", function(error, data) {
            if (error) {
                resp.status = 404;
                resp.end("Resourse not found");
            } else {
                resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                resp.end(data);
            }
        });
    } else {
        resp.status = 404;
        resp.end("Resourse not found");
    }
}).listen(3000, ()=>console.log("Server started at 3000"));

import http from "http";
import url from "url";
import fs from "fs";

let fact = (n) => n === 0 ? 1 : fact(n-1) * n;

http.createServer(function (req, resp) {

    let pathname = url.parse(req.url).pathname;
    let k = url.parse(req.url, true).query.k;

    if (pathname === "/fact" && k != null && !isNaN(k)) {
        k = +k;
        resp.writeHead(200, {'Content-Type' : 'application/json'});
        resp.end(JSON.stringify({k: k, fact: fact(k)}));
    } else if (pathname === "/") {
        fs.readFile("03-03.html", function (err, data) {
            if (err) {
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

}).listen(3000, "127.0.0.1");

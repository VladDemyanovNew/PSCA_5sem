import http from "http";
import url from "url";
import fs from "fs";
import send from "./m0603.js";

http.createServer((req, resp) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === "/" && req.method === "GET") {
        fs.readFile("index.html", function (err, data) {
            if (err) {
                resp.status = 404;
                resp.end("Resourse not found");
            } else {
                resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                resp.end(data);
            }
        });
    } else if (pathname === "/" && req.method === "POST") {
        req.on("data", (data) => {
            let mail = JSON.parse(data);
            send("Testing sendMail", mail.message, mail.senderName, mail.reciever);
            resp.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            let respText = "Status: OK. Data: " + JSON.stringify(mail);
            resp.end(respText);
        });
    } else {
        resp.status = 404;
        resp.end("Resourse not found");
    }
}).listen(5000, "127.0.0.1");
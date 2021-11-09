import http from "http";
import url from "url";
import fs from "fs";
import formidable from "formidable";
import Util from "./../Lab8/util.js";

const server = http.createServer();
let util = new Util(server);

let http_handler = (req, resp) => {
    let path = url.parse(req.url).pathname;
    if (path === "/task1" && req.method === "GET") {
        resp.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
        resp.end("<h1>Hello client!</h1>");
    } else if (path === "/task2" && req.method === "GET") {
        let x = url.parse(req.url, true).query.x;
        let y = url.parse(req.url, true).query.y;
        resp.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
        resp.end(`<h1>Parameters: x=${x} y=${y}</h1>`);
    } else if (path === "/task3" && req.method === "POST") {
        req.on("data", (data) => {
            resp.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
            resp.end(data.toString());
        });
    } else if (path === "/task4" && req.method === "POST")
        util.handlePathJson(req, resp);
    else if (path === "/task5" && req.method === "POST")
        util.handlePathXml(req, resp);
    else if (path === "/task6" && req.method === "POST") {
        req.on("data", (data) => {
            resp.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
            resp.end(data.toString());
        });
    } else if (path === "/task7" && req.method === "POST") {
        let form = new formidable.IncomingForm({uploadDir: "static"});

        form.parse(req, (err, fields, files) => {
            console.log(files);
            if (err)
                resp.end("<h1>File has not been uploaded</h1>");
            else
                resp.end("<h1>File has been uploaded</h1>");
        });
    } else if (path === "/task8" && req.method === "GET") {
        resp.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        fs.createReadStream("static/MyFile.txt").pipe(resp);
    } else
        util.writeHTTP404(resp);
};

server.listen(3000, "127.0.0.1", () => {console.log("server.listen(5000)")})
    .on("error", (e) => {console.log("server.listen(5000): error: ", e.code)})
    .on("request", http_handler);
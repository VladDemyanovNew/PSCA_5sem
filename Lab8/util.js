import url from "url";
import fs from "fs";
import xml2js from "xml2js";
import formidable from "formidable";

const validExts = [
    {ext: "html", headers: {"Content-Type": "text/html; charset=utf-8"}},
    {ext: "css", headers: {"Content-Type": "text/css; charset=utf-8"}},
    {ext: "js", headers: {"Content-Type": "text/javascript; charset=utf-8"}},
    {ext: "jpg", headers: {"Content-Type": "image/jpg; charset=utf-8"}},
    {ext: "docx", headers: {"Content-Type": "application/msword; charset=utf-8"}},
    {ext: "json", headers: {"Content-Type": "application/json; charset=utf-8"}},
    {ext: "xml", headers: {"Content-Type": "application/xml; charset=utf-8"}},
    {ext: "mp4", headers: {"Content-Type": "video/mp4; charset=utf-8"}},
    {ext: "txt", headers: {"Content-Type": "text/plain; charset=utf-8"}}
];

function isStatic(ext, fn) {
    let reg = new RegExp(`^\/.+\.${ext}$`);
    return reg.test(fn);
}

export default class Util {
    #server;
    #serverStopping = false;

    constructor(server) {
        this.#server = server;
    }

    writeHTTP405(resp) {
        resp.statusCode = 405;
        resp.statusMessage = "Request method is known by the server but is not supported by the target resource";
        resp.end("<h1>Request method is known by the server but is not supported by the target resource</h1>");
    }

    writeHTTP404(resp) {
        resp.statusCode = 404;
        resp.statusMessage = "Resourse is not found";
        resp.end("<h1>Resourse is not found</h1>");
        console.log("Resourse is not found");
    }

    handlePathConnection(req, resp) {
        let set = url.parse(req.url, true).query.set;
        if (set && !isNaN(set)) {
            this.#server.keepAliveTimeout = +set;
            resp.end(`<h1>updated KeepAliveTimeout: ${this.#server.keepAliveTimeout}</h1>`);
        } else {
            resp.end(`<h1>KeepAliveTimeout: ${this.#server.keepAliveTimeout}</h1>`);
        }
    }

    handlePathHeaders(req, resp) {
        resp.setHeader("setedHeader1", 1000);
        resp.end(`<h1>Request headers: </h1></br>${JSON.stringify(req.headers)}`);
    }

    handlePathParameter(req, resp) {
        let x = url.parse(req.url, true).query.x;
        let y = url.parse(req.url, true).query.y;

        if (new RegExp("\/parameter\/\\w+\/\\w+$").test(url.parse(req.url).pathname))
            [x, y] = url.parse(req.url).pathname.split("/").slice(2, 4);

        if (x && y && !isNaN(x) && !isNaN(y)) {
            x = +x;
            y = +y;
            let sum = x + y;
            let sub = x - y;
            let div = x / y;
            let mul = x * y;
            resp.write(`<h1>${x} + ${y} = ${sum}</h1>`);
            resp.write(`<h1>${x} - ${y} = ${sub}</h1>`);
            resp.write(`<h1>${x} * ${y} = ${mul}</h1>`);
            resp.write(`<h1>${x} / ${y} = ${div}</h1>`);
            resp.end();
        } else {
            resp.end(`<h1>URI: ${req.url}</h1>`);
        }
    }

    handlePathClose(req, resp) {
        if (!this.#serverStopping) {
            this.#serverStopping = true;
            resp.end("<h1>Server will be stopped in 10s</h1>");
            setTimeout(()=> {
                console.log("Server is stopped");
                this.#server.close();
            }, 3000);
        } else {
            resp.end("<h1>The process of stopping server has been already started.</h1>");
        }
    }

    handlePathSocket(req, resp) {
        resp.write(`<h1>Client IP: ${req.connection.remoteAddress}</h1>`);
        resp.write(`<h1>Clent port: ${req.connection.remotePort}</h1>`);
        resp.write(`<h1>Server IP: ${req.socket.localAddress}</h1>`);
        resp.write(`<h1>Server port: ${req.socket.localPort}</h1>`);
        resp.end();
    }

    handlePathReqData(req, resp) {
        let buf = '';
        req.on("data", (data) => {
            console.log("data = ", data.toString());
            buf += data;
        });
        req.on('end', () => {
            console.log('data (end) = ', buf);
        });
    }

    handlePathRespStatus(req, resp) {
        let statusCode = url.parse(req.url, true).query.code;
        let statusMessage = url.parse(req.url, true).query.mess;

        if (statusCode && statusMessage && !isNaN(statusCode)) {
            resp.statusCode = statusCode;
            resp.statusMessage = statusMessage;
            resp.end("<h1>Parameters have been set successfully</h1>");
        } else {
            resp.end("<h1>Parameters have been set incorrectly</h1>");
        }
    }

    handlePathFormparameter(req, resp) {
        if (req.method === "GET")
            fs.readFile("index.html", (err, data)=> {
                if (err) {
                    this.writeHTTP404(resp);
                } else {
                    resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    resp.end(data);
                }
            });
        else if (req.method === "POST")
            req.on("data", (data) => {
                resp.end(data.toString());
            });
        else
            this.writeHTTP405(resp);
    }

    handlePathJson(req, resp) {
        try {
            req.on("data", (data) => {
                data = JSON.parse(data);
                let responsJson = {
                    __comment: 'Ответ.' + data.__comment,
                    x_plus_y: data.x + data.y,
                    Concatenation_s_o: data.s + ': ' + data.o.surname + ', ' + data.o.name,
                    Length_m: data.m.length
                };
                resp.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
                resp.end(JSON.stringify(responsJson));
            });
        } catch (err) {
            this.writeHTTP404(resp);
        }
    }

    handlePathXml(req, resp) {
        let parser = new xml2js.Parser();
        req.on("data", (data) => {
            parser.parseString(data, (err, result) => {
                let sum = result.request.x.reduce((sum, current) => sum + +current.$.value, 0);
                let concat = result.request.m.reduce((result, current) => result + current.$.value, "");
                let obj = {response: {
                    $: {id: result.request.$.id, request: result.request.$.id},
                    sum: [{$: {element: "x", result: sum}}],
                    concat: [{$: {element: "m", result: concat}}]
                }};
                let builder = new xml2js.Builder();
                let xmlResult = builder.buildObject(obj);
                resp.writeHead(200, {"Content-Type": "application/xml; charset=utf-8"});
                resp.end(xmlResult.toString());
            });

        });
    }

    handlePathFiles(req, resp) {
        if (url.parse(req.url).pathname === "/files") {
            resp.setHeader("X-static-files-count", fs.readdirSync("./static").length);
            resp.end();
        } else if (RegExp("^\/files\/\\w+$").test(url.parse(req.url).pathname)) {
            let filename = url.parse(req.url).pathname.split("/")[2];
            this.#sendFile(filename, resp);
        } else {
            this.writeHTTP404(resp);
        }
    }

    handlePathUpload(req, resp) {
        if (req.method === "POST") {
            let form = new formidable.IncomingForm({uploadDir: "static"});

            form.parse(req, (err, fields, files) => {
                console.log(files);
                if (err)
                    resp.end("<h1>File has not been uploaded</h1>");
                else
                    resp.end("<h1>File has been uploaded</h1>");
            });
        } else if (req.method === "GET") {
            resp.writeHead(200, {'Content-type': 'text/html'});
            resp.end(`
                 <form method="POST" action="/upload" enctype="multipart/form-data">
                    <div>File: <input type="file" name="file" /></div>
                    <input type="submit" value="Upload" />
                 </form>
            `);
        } else {
            this.writeHTTP405(resp);
        }
    }

    #sendFile(filename, resp) {
        fs.readdir("static/", function(err, files){
            files.forEach(file => {
                let stat = fs.statSync("static/" + file);
                if (stat.isFile() && file.split(".")[0] === filename) {
                    fs.readFile("static/" + file, 'utf8', (err, data) => {
                        if (err) {
                            resp.status = 404;
                            resp.end("Resourse not found");
                        } else {
                            let validExt = validExts.find(item => isStatic(item.ext, "/"+file));
                            if (typeof validExt != "undefined") {
                                resp.writeHead(200, validExt.headers);
                                resp.end(data);
                            } else {
                                resp.status = 404;
                                resp.end("Resourse not found");
                            }
                        }
                    });
                    return;
                }
            });
        });
    }
}
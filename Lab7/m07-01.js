import fs from "fs";

const validExts = [
    {ext: "html", headers: {"Content-Type": "text/html; charset=utf-8"}},
    {ext: "css", headers: {"Content-Type": "text/css; charset=utf-8"}},
    {ext: "js", headers: {"Content-Type": "text/javascript; charset=utf-8"}},
    {ext: "jpg", headers: {"Content-Type": "image/jpg; charset=utf-8"}},
    {ext: "docx", headers: {"Content-Type": "application/msword; charset=utf-8"}},
    {ext: "json", headers: {"Content-Type": "application/json; charset=utf-8"}},
    {ext: "xml", headers: {"Content-Type": "application/xml; charset=utf-8"}},
    {ext: "mp4", headers: {"Content-Type": "video/mp4; charset=utf-8"}}
];

export default class StaticAccessor {
    constructor(root) {
        this._root = root;
    }

    isStatic(ext, fn) {
        let reg = new RegExp(`^\/.+\.${ext}$`);
        return reg.test(fn);
    }

    #pathStatic(fn) {
        return this._root + fn;
    }

    #pipeFile(req, resp, headers) {
        resp.writeHead(200, headers);
        fs.createReadStream(this.#pathStatic(req.url)).pipe(resp);
    }

    writeHTTP405(resp) {
        resp.statusCode = 405;
        resp.statusMessage = "Request method is known by the server but is not supported by the target resource";
        resp.end("Request method is known by the server but is not supported by the target resource");
    }

    writeHTTP404(resp) {
        resp.statusCode = 404;
        resp.statusMessage = "Resourse is not found";
        resp.end("Resourse is not found");
    }

    #sendFile(req, resp, headers) {
        fs.access(this.#pathStatic(req.url), fs.constants.R_OK, err => {
            if (err) this.writeHTTP404(resp);
            else this.#pipeFile(req, resp, headers);
        });
    }

    getFile(req, resp) {
        let validExt = validExts.find(item => this.isStatic(item.ext, req.url));
        if (typeof validExt != "undefined")
            this.#sendFile(req, resp, validExt.headers);
        else
            this.writeHTTP404(resp);
    }
}
import http from "http";
import Util from "./util.js";
import url from "url";

const server = http.createServer();
let util = new Util(server);

let http_handler = (req, resp) => {
    let path = url.parse(req.url).pathname;

    switch (req.method) {
        case "GET":
            if (path === "/connection")
                util.handlePathConnection(req,resp);
            else if (path === "/headers")
                util.handlePathHeaders(req, resp);
            else if (new RegExp("\/parameter").test(path))
                util.handlePathParameter(req, resp);
            else if (path === "/close")
                util.handlePathClose(req, resp);
            else if (path === "/socket")
                util.handlePathSocket(req, resp);
            else if (path === "/req-data")
                util.handlePathReqData(req, resp);
            else if (path === "/resp-status")
                util.handlePathRespStatus(req, resp);
            else if (path === "/formparameter")
                util.handlePathFormparameter(req, resp);
            else if (new RegExp("\/files").test(path))
                util.handlePathFiles(req, resp);
            else if (path === "/upload")
                util.handlePathUpload(req, resp);
            else
                util.writeHTTP404(resp);
            break;
        case "POST":
            if (path === "/formparameter")
                util.handlePathFormparameter(req, resp);
            else if (path === "/json")
                util.handlePathJson(req, resp);
            else if (path === "/xml")
                util.handlePathXml(req, resp);
            else if (path === "/upload")
                util.handlePathUpload(req, resp);
            else
                util.writeHTTP404(resp);
            break;
        default:
            util.writeHTTP405(resp);
    }
};

server.listen(5000, "127.0.0.1", () => {console.log("server.listen(5000)")})
    .on("error", (e) => {console.log("server.listen(5000): error: ", e.code)})
    .on("request", http_handler);


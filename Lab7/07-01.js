import http from "http";
import StaticAccessor from "./m07-01.js";

const staticAccessor = new StaticAccessor("./static");

let http_handler = (req, resp) => {
    if (req.method != "GET") {
        staticAccessor.writeHTTP405(resp);
    } else {
        if (req.url === "/") {
            req.url = "/index.html";
            staticAccessor.getFile(req, resp);
        } else {
            staticAccessor.getFile(req, resp);
        }
    }
};

http.createServer()
    .listen(5000, "127.0.0.1", () => {console.log("server.listen(5000)")})
    .on("error", (e) => {console.log("server.listen(5000): error: ", e.code)})
    .on("request", http_handler);
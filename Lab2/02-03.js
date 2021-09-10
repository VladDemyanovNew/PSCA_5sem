import http from "http";

http.createServer(function (req, resp) {
    if (req.url === "/api/name") {
        resp.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
        resp.end("Демьянов Владислав Русланович");
    } else {
        resp.status = 404;
        resp.end("Resourse not found", "utf-8");
    }
}).listen(3000, ()=>console.log("Server started at 3000"));
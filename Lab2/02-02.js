import http from "http";
import fs from "fs";

http.createServer(function (req, resp) {
    if (req.url === "/png") {
        fs.readFile("image.png", function (err, data) {
            if (err) {
                resp.status = 404;
                resp.end("Resourse not found");
            } else {
                resp.contentType='image/png';
                resp.end(data, 'binary');
            }

        });
    } else {
        resp.status = 404;
        resp.end("Resourse not found");
    }
}).listen(3000, ()=>console.log("Server started at 3000"));
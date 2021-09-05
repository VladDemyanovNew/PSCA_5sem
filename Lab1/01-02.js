const http = require("http");

http.createServer(function(req, resp) {
    resp.end("<h1>Hello world!</h1>");
}).listen(3000, "127.0.0.1", function() {
    console.log("Сервер начал прослушивание на порту 3000");
});
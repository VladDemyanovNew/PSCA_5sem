const http = require("http");

http.createServer(function (req, resp) {
    let b = '';
    req.on('data', chunk => {b += chunk.toString(); console.log(chunk.toString())});

    resp.setHeader("Content-Type", "text/html");
    resp.write(`<!DOCTYPE html>
                <html>
                <head>
                <title>Hello Node.js</title>
                <meta charset=\"utf-8\" />
                <style> .paint {color: red; font-weight: bold;} </style>
                </head>
                <body>
                <p><span class="paint">Url:</span> ${req.url}</p>
                <p><span class="paint">Тип запроса:</span> ${req.method}</p>
                <p><span class="paint">Версия:</span> ${req.httpVersion}/<p>
                <p><span class="paint">User-Agent:</span> + ${req.headers["user-agent"]}</p>
                <p class="paint">Заголовки:</p>
                ${GetHeaders(req)}
                <p><span class="paint">Тело запроса:</span> ${b}</p>
                </body>
                </html>`);
    resp.end();
}).listen(3000, "127.0.0.1", function() {
    console.log("Сервер начал прослушивание на порту 3000");
});

function GetHeaders(req) {
    let result = "";
    for (let key in req.headers)
        result += `<p>${key}: ${req.headers[key]}</p>`;
    return result;
}
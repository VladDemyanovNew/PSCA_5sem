import http from 'http';
import url from 'url';
import HttpHandler from './httpHandler.js';

http.createServer((request, response) => {
    const pathname = url.parse(request.url).pathname;

    switch (request.method) {
        case 'GET':
            HttpHandler.onGet(request, response);
            break;
        case 'POST':
            HttpHandler.onPost(request, response);
            break;
        case 'PUT':
            HttpHandler.onPut(request, response);
            break;
        case 'DELETE':
            HttpHandler.onDelete(request, response);
            break
        default:
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
            break;
    }

}).listen(3000, '127.0.0.1', () => {console.log("server.listen(3000)")});
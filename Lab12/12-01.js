import http from 'http';
import url from 'url';
import HttpHandler from './httpHandler.js';
import { Server } from 'rpc-websockets';
import fs from 'fs';

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

}).listen(3000, '127.0.0.1');


const server = new Server({ port: 4000, host: 'localhost'});
server.event('backup-change');

fs.watch('./static/backup', {encoding: 'buffer'}, (eventType, filename) => {
    if(eventType === 'change') {
        server.emit('backup-change');
        console.log(filename + ' изменён');
    }
});
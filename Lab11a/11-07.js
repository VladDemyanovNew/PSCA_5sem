const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({port: 4000, host: 'localhost'});

server.register('A', (params) => {console.log('notifyA')}).public();
server.register('B', (params) => {console.log('notifyB')}).public();
server.register('C', (params) => {console.log('notifyC')}).public();
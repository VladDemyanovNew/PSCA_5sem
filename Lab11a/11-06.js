const rpcWSS = require('rpc-websockets').Server;

const server = new rpcWSS({ port: 4000, host: 'localhost'});

server.event('A');
server.event('B');
server.event('C');

console.log('Input A, B or C to choose event');

process.stdin.setEncoding('utf-8');
process.stdout.write("Your choose: ");
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        process.stdout.write("Your choose: ");
        server.emit(chunk.trim());
    }
});
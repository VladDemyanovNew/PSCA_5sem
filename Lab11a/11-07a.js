const rpcWSC = WebSocket = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

console.log('Input A, B or C to choose notify');
process.stdin.setEncoding('utf-8');
process.stdout.write("Your choose: ");
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        process.stdout.write("Your choose: ");
        ws.notify(chunk.trim());
    }
});
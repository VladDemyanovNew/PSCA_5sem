import net from 'net';
import { Buffer } from 'buffer';

let sum = 0;
let connections = new Map();

net.createServer((sock) => {
    console.log('client connected');
    sock.id = (new Date()).toISOString();
    connections.set(sock.id, 0);

    sock.on('data', (data) => {
        console.log(`Data from client: ${data.readInt32LE()}`);

        sum = data.readInt32LE() + connections.get(sock.id);
        connections.set(sock.id, sum);
        console.log(`Sum: ${sum}`);
        sum = 0;
    });

    let buffer = Buffer.alloc(4);
    let timerId = setInterval(() => {
        buffer.writeInt32LE(connections.get(sock.id), 0);
        sock.write(buffer);
    }, 5000);

    sock.on('error', (e) => {
        console.log(`Server error: ${e}`);
        connections.delete(sock.id);
    });

    sock.on('close', () => {
        clearInterval(timerId);
        connections.delete(sock.id);
        console.log("Server closed");
    });

}).listen(2000, () => {
    console.log('Server is listening');
});
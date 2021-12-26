import net from 'net';
import { Buffer } from 'buffer';

let sum = 0;

net.createServer((sock) => {

    console.log('client connected');

    sock.on('data', (data) => {
        console.log(`Data from client: ${data.readInt32LE()}`);

        sum += data.readInt32LE();
    });

    let buffer = Buffer.alloc(4);
    let timerId = setInterval(() => {
        buffer.writeInt32LE(sum, 0);
        sock.write(buffer);
    }, 5000);

    sock.on('error', (e) => {
        console.log(`Server error: ${e}`);
    });

    sock.on('close', () => {
        clearInterval(timerId);
        console.log("Server closed");
    });

}).listen(2000, () => {
    console.log('Server is listening');
});
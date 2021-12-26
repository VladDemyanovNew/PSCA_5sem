import net from 'net';
import { Buffer } from 'buffer';

let parm = process.argv[2];
let x = parm ?? 1;

let buffer = new Buffer.alloc(4);

const client = net.connect({port: 2000}, () => {
    console.log(`Connected to server!`);

    let timerId = setInterval(() => {
        client.write((buffer.writeInt32LE(x, 0), buffer));
    }, 1000);

    setTimeout(() => {
        clearInterval(timerId);
        client.end();
    }, 20000);
});

client.on('data', data => {
    console.log(`Data from server: ${data.readInt32LE()}`);
});

client.on('end', () => {
    console.log('disconnected from server');
});

client.on('close', () => {
    console.log('Client closed');
});

client.on('error', (e) => {
    console.log('Client error: ', e);
});

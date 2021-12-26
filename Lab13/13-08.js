import net from 'net';
import { Buffer } from 'buffer';

let parm = process.argv[2];
let port = parm ?? 40000;

let buffer = new Buffer.alloc(4);

const client = net.connect({port: port}, () => {
    console.log(`Connected to server: ${client.remoteAddress}:${client.remotePort}`);

    let x = 0;
    setInterval(() => {
        client.write((buffer.writeInt32LE(x++, 0), buffer));
    }, 1000);
});

client.on('data', data => {
    console.log(`Data from server: ${data.toString()}`);
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

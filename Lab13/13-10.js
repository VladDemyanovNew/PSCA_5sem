import dgram from 'dgram';
import { Buffer } from 'buffer';

const message = Buffer.from('test');
const client = dgram.createSocket('udp4');

client.on('message', (dataFromServer, info) => {
    console.log(`Data from server: ${dataFromServer.toString()}`);
    console.log('Received %d bytes from %s:%d\n',dataFromServer.length, info.address, info.port);
})

client.send(message, 2000, 'localhost', (err) => {
    console.log(err);
    client.close();
});
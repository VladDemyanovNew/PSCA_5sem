import dgram from 'dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (message, info) => {
    console.log(`server got: ${message} from ${info.address}:${info.port}`);
    server.send(message, info.port, 'localhost', (err) => {
        if (err) {
            server.close();
        } else {
            console.log('Message has been sent successfully');
        }
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(2000);
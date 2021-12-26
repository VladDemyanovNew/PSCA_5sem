import net from 'net';

const port1 = 40000;
const port2 = 50000;

net.createServer((sock) => start(sock)).listen(port1, () => {
    console.log(`Server is listening on the port ${port1}`);
});
net.createServer((sock) => start(sock)).listen(port2, () => {
    console.log(`Server is listening on the port ${port2}`);
});

function start(sock) {
    console.log(`Client connected (${sock.remoteAddress}:${sock.remotePort})`);

    sock.on('data', (data) => {
        let number = data.readInt32LE().toString();
        console.log(`Data from client: ${number}`);
        sock.write('ECHO: ' + number);
    });

    sock.on('error', (e) => {
        console.log(`Server error: ${e}`);
    });

    sock.on('close', () => {
        console.log("Server closed");
    });
}

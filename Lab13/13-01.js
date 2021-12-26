import net from 'net';

net.createServer((sock) => {
    console.log('client connected');

    sock.on('error', (e) => {
        console.log(`Server error: ${e}`);
    });

    sock.on('data', (data) => {
        console.log(`Data from client: ${data.toString()}`);
        sock.write(`ECHO: ${data}`);
    });

    sock.on('close', () => {
        console.log("Server closed");
    });
}).listen(2000, () => {
    console.log('Server is listening');
});
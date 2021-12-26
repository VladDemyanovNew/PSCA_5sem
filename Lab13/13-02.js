import net from 'net';

const client = net.connect({port: 2000}, () => {
    console.log(`Connected to server!`);
});

let message = 'Hello from client!';
client.write(message);

client.on('data', data => {
    console.log(`Data from server: ${data.toString()}`);
    client.end();
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

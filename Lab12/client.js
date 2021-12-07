import { Client } from 'rpc-websockets';

let ws = new Client('ws://localhost:4000');

ws.on('open', () => {
    ws.subscribe('backup-change');
    ws.on('backup-change', () => console.log('Произошли изменения в backup\n'));
});
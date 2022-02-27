import { Client } from 'rpc-websockets';

const ws = new Client('ws://localhost:3000');

const loginOptions = {
    login: 'admin',
    password: 'admin'
}

ws.on('open', () => {
    ws.login(loginOptions).then(() => {
        ws.call('refillBalance', ['user2', 4])
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }).catch(error => console.log(error));
});

const async = require("async");
const rpcWSS = WebSocket = require("rpc-websockets").Client;

let ws = new rpcWSS("ws://localhost:4000");

let h = (x = ws) => async.parallel({
    square1: (cb) => {
        ws.call("square", [3]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    },
    square2: (cb) => {
        ws.call("square", [5, 4]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    },
    mul1: (cb) => {
        ws.call("mul", [3, 5, 7, 9, 11, 13]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    },
    fib: (cb) => {
        ws.login({login: "vdemyanov", password: "admin"})
            .then((login) => {
                if (login)
                    ws.call("fib", [7]).catch((e) => cb(e, null)).then((r) => cb(null, r));
                else
                    cb({message1: "login error"}, null);
            });
    },
    mul2: (cb) => {
        ws.call("mul", [2, 4, 6]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    },
    sum: (cb) => {
        ws.call("sum", [1, 2, 3, 4]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    },
    fact: (cb) => {
        ws.login({login: "vdemyanov", password: "admin"})
            .then((login) => {
                if (login)
                    ws.call("fact", [3]).catch((e) => cb(e, null)).then((r) => cb(null, r));
                else
                    cb({message1: "login error"}, null);
            });
    }
}, (e, r) => {
    if (e) console.log("err = ", e);
    else console.log("result = ", r);
    ws.close();
});

ws.on("open", h);
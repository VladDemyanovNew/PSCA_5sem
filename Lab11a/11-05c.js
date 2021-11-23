const async = require("async");
const rpcWSS = WebSocket = require("rpc-websockets").Client;

let ws = new rpcWSS("ws://localhost:4000");

// sum(square(3), square(5,4), mul(3,5,7,9,11,13))
// +fib(7)
// *mul(2,4,6)

let h = () => async.waterfall([
    (cb) => {
        ws.call("square", [3]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    },
    (arg1, cb) => {
        ws.call("square", [5, 4]).catch((e) => cb(e, null)).then((r) => cb(null, arg1, r));
    },
    (arg1, arg2, cb) => {
        ws.call("mul", [3, 5, 7, 9, 11, 13]).catch((e) => cb(e, null)).then((r) => cb(null, arg1, arg2, r));
    },
    (arg1, arg2, arg3, cb) => {
        ws.login({login: "vdemyanov", password: "admin"})
            .then((login) => {
                if (login)
                    ws.call("fib", [7]).catch((e) => cb(e, null)).then((r) => cb(null, arg1, arg2, arg3, r));
                else
                    cb({message1: "login error"}, null);
            });
    },
    (arg1, arg2, arg3, arg4, cb) => {
        ws.call("sum", [arg1, arg2, arg3, arg4]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    },
    (arg1, cb) => {
        ws.call("mul", [arg1, 2, 4, 6]).catch((e) => cb(e, null)).then((r) => cb(null, r));
    }
], (err, result) => {
    if (err) console.log("err = ", err);
    else console.log("result = ", result);
    ws.close();
});

ws.on("open", h);


//
// (cb) => {
//     ws.call("square", [3]).catch((e) => cb(e, null)).then((r) => cb(null, r));
// },
//     (arg1, cb) => {
//         ws.call("square", [5, 4]).catch((e) => cb(e, null)).then((r) => cb(null, arg1, r));
//     },
//     (arg1, arg2, cb) => {
//         ws.call("mul", [3, 5, 7, 9, 11, 13]).catch((e) => cb(e, null)).then((r) => cb(null, arg1, arg2, r));
//     },
//     (arg1, arg2, arg3, cb) => {
//         ws.login({login: "vdemyanov", password: "admin"})
//             .then((login) => {
//                 if (login)
//                     ws.call("fib", [7]).catch((e) => cb(e, null)).then((r) => cb(null, arg1, arg2, arg3, r));
//                 else
//                     cb({message1: "login error"}, null);
//             });
//     },
//     (arg1, arg2, arg3, arg4, cb) => {
//         ws.call("mul", [arg1, arg2, arg3, arg4]).catch((e) => cb(e, null)).then((r) => cb(null, r));
//     },
//     (arg1, cb) => {
//         ws.call("mul", [arg1, 2, 4, 6]).catch((e) => cb(e, null)).then((r) => cb(null, r));
//     }
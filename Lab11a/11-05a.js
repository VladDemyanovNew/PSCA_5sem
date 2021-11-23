const rpcWSS = WebSocket = require("rpc-websockets").Client;

let ws = new rpcWSS("ws://localhost:4000");

ws.on("open", () => {
   ws.call("square", [1, 2]).then((r) => {console.log("square = ", r)});
   ws.call("sum", [1, 2, 3, 4]).then((r) => {console.log("sum = ", r)});
   ws.call("mul", [1, 2, 3, 4]).then((r) => {console.log("mul = ", r)});

   ws.login({login: "vdemyanov", password: "admin"})
       .then((login) => {
            if (login) {
                ws.call("fact", [3]).then((r) => {console.log("fact = ", r)});
                ws.call("fib", [3]).then((r) => {console.log("fib = ", r)});
            } else {
                console.log("login error");
            }
       });


});
const rpcWSS = require("rpc-websockets").Server;

let server = new rpcWSS({port: 4000, host: "localhost"});

server.setAuth((l) => {return (l.login === "vdemyanov" && l.password === "admin")});

server.register("square", (params) => {
    let a = params[0];
    let b = params[1];
    if (!isNaN(a) && !isNaN(b))
        return a * b;
    else if (!isNaN(a))
        return Math.PI * Math.pow(a, 2);
    else
        return "Ошибка: параметры не найдены или тип параметров задан некорректно";
}).public();

server.register("sum", (params) => {
    if (params.every((item) => {return !isNaN(item)}))
        return params.reduce((sum, current) => {return sum + +current;}, 0);
    else
        return "Ошибка: параметры не найдены или тип параметров задан некорректно";
}).public();

server.register("mul", (params) => {
    if (params.every((item) => {return !isNaN(item)}))
        return params.reduce((sum, current) => {return sum * current;}, 1);
    else
        return "Ошибка: параметры не найдены или тип параметров задан некорректно";
}).public();

let fact = (n) => n === 0 ? 1 : fact(n - 1) * n;
let fib =  (n) => n <= 1 ? n : fib(n - 1) + fib(n - 2);

server.register("fact", (params) => {
    let n = params[0];
    if (!isNaN(n))
        return fact(n);
    else
        return "Ошибка: параметры не найдены или тип параметров задан некорректно";
}).protected();

server.register("fib", (params) => {
    let n = params[0];
    if (!isNaN(n))
        return fib(n);
    else
        return "Ошибка: параметры не найдены или тип параметров задан некорректно";
}).protected();
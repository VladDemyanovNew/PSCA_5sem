import http from "http";

let params = JSON.stringify({
    __comment: "Запрос.Лабораторная работа 8/10",
    x: 1,
    y: 2,
    s: "Сообщение",
    m: ["a","b","c","d"],
    o:{"surname":"Демьянов", "name":"Влад"}
});

let options = {
    host: "localhost",
    path: "/task4",
    port: 3000,
    method: "POST"
}

const req = http.request(options, (res) => {
    console.log("response = ", res.statusCode);
    let data = "";
    res.on("data", (chunk) => {
        console.log("data body = ", data += chunk.toString("utf8"));
    });
    res.on("end", () => {
        console.log("end body = ", data);
    });
});

req.on("error", (e) => {
    console.log("error = ", e.message);
});

req.write(params);

req.end();

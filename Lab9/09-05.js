import http from "http";

let params = "<request id=\"28\"><x value=\"1\"/><x value=\"2\"/><m value=\"a\"/><m value=\"b\"/><m value=\"c\"/></request>";

let options = {
    host: "localhost",
    path: "/task5",
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

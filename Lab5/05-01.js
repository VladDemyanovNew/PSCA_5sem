import http from "http";
import url from "url";
import fs from "fs";
import DB from "./DB.js";
import Util from "./util.js";

const dbInstance = new DB();
process.stdin.unref();

dbInstance.on("GET", async (req, resp) => {
    console.log("get");
    dbInstance.increaseReqCount();
    let id = url.parse(req.url, true).query.id;

    if (id && !isNaN(id)) {
        let user = dbInstance.getUserById(+id);
        console.log(user);
        await resp.end(JSON.stringify(user));
    } else {
        await resp.end(JSON.stringify(dbInstance.select()));
    }
});

dbInstance.on("POST", async (req, resp) => {
    console.log("post");
    dbInstance.increaseReqCount();
    req.on("data", async data => {
        let user = JSON.parse(data);
        user.id = dbInstance.getUsersLength();
        dbInstance.insert(user);
        await resp.end(JSON.stringify(user));
    });
});

dbInstance.on("PUT", async (req, resp) => {
    console.log("put");
    dbInstance.increaseReqCount();
    req.on("data", async data => {
        let user = JSON.parse(data);
        console.log(user);
        dbInstance.update(user);
        await resp.end(JSON.stringify(user));
    });
});

dbInstance.on("DELETE", async (req, resp) => {
    console.log("delete");
    dbInstance.increaseReqCount();
    let id = url.parse(req.url, true).query.id;
    if (id && !isNaN(id)) {
        let deletedUser = dbInstance.delete(+id);
        await resp.end(JSON.stringify(deletedUser));
    }
});

dbInstance.on("COMMIT", () => {
    dbInstance.commit();
});

function processRoutes(req, resp, pathname) {
    if (pathname === "/") {
        fs.readFile("index.html", function (err, data) {
            if (err) {
                resp.status = 404;
                resp.end("Resourse not found");
            } else {
                resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                resp.end(data);
            }
        });
    } else if (pathname === "/api/db") {
        dbInstance.emit(req.method, req, resp);
    } else if (pathname === "/api/ss") {
        resp.end(JSON.stringify(dbInstance.getStat()));
    } else {
        resp.status = 404;
        resp.end("Resourse not found");
    }
}

let server = http.createServer((req, resp) => {
    const pathname = url.parse(req.url).pathname;
    processRoutes(req, resp, pathname);

}).listen(5000, "127.0.0.1");

let utilInstance = new Util(server, dbInstance);

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        let [command, sec] = chunk.trim().split(" ");

        switch (command) {
            case "sd":
                utilInstance.sd(sec);
                break;
            case "sc":
                utilInstance.sc(sec);
                break;
            case "ss":
                utilInstance.ss(sec);
                break;
            default:
                console.log("Команда не найдена!");
                break;
        }
    }
});
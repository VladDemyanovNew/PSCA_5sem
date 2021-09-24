import http from "http";

let currentState = "norm";
const states = ["norm", "stop", "test", "idle"];

http.createServer(function (req, resp) {
    resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    resp.end(`<h1>${currentState}</h1>`);
}).listen(3000, "127.0.0.1");

process.stdin.setEncoding('utf-8');
process.stdout.write("Server running at http://localhost:3000/\n");
process.stdout.write(`${currentState}->`);

process.stdin.on('readable', ()=> {
   let chunk = null;
   while ((chunk = process.stdin.read()) != null) {
       if (states.includes(chunk.trim())) {
           process.stdout.write(`reg = ${currentState}--> ${chunk.trim()}\n`);
           currentState = chunk.trim();
           process.stdout.write(`${currentState}->`);
       } else if (chunk.trim() === 'exit') {
           process.exit(0);
       } else {
           process.stderr.write(`${currentState}->`);
       }
   }
});



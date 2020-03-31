const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    
    if (url === '/') {
        res.write('<html><head><title>Enter a message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text"/><button type="submit">send</button></form></body></html>');
        return res.end();
    }

    if (url === '/message' && method === 'POST') {
        fs.writeFileSync('message.text', 'dummy');
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();     
    }
    res.setHeader('Content-type', 'text/html');
    res.write('<html><head><title>My First Page node</title></head>');
    res.write('<body><h1>Hello from my Node.Js Server!</h1></body></html>');
    res.end();
});

server.listen(3000);
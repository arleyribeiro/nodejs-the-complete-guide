const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        res.write('<html><head><title>Enter a message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text"/><button type="submit">send</button></form></body></html>');
        return res.end();
    }
    res.setHeader('Content-type', 'text/html');
    res.write('<html><head><title>My First Page node</title></head>');
    res.write('<body><h1>Hello from my Node.Js Server!</h1></body></html>');
    res.end();
});

server.listen(3000);
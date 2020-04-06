
const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html><head><title>Enter a message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">send</button></form></body></html>');
        return res.end();
    }
    
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
    
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.text', message, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();     
            });
        })
    }
    res.setHeader('Content-type', 'text/html');
    res.write('<html><head><title>My First Page node</title></head>');
    res.write('<body><h1>Hello from my Node.Js Server!</h1></body></html>');
    res.end();
};

// Conection module files
module.exports = requestHandler;

/* module.exports = {
    handler: requestHandler,
    someText: 'Second export'
} */

// module.exports.handler = requestHandler;
// module.exports.someText = 'Conection module'

// exports.handler = requestHandler;
// exports.someText = 'Connection module';

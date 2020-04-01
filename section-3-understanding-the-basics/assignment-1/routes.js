const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html><title>Welcome</title><h1>First Page</h1>');
        res.write('<html><title>Welcome</title><body><a href="/create-user">New user</a><br><a href="/users">List of dummy users</a></body></html>');
        res.write('</body></html>');
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        console.log("/create-user")
        req.on('data', (chunk) => {
            console.log("chunk: ", chunk)
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody)       
            const username = parsedBody.split('=')[1];
            console.log('username: ', username);
            fs.writeFile('message.text', username, (err) => {
                res.statusCode = 302;
                res.setHeader('Location', '/users');
                return res.end();     
            });
        });
    }

    if (url === '/users') {
        res.write('<html><title>Welcome</title><body><h1>Dummy users</h1><ul><li>User 1</li><li>User 2</li></ul><br><a href="/">homepage</a></body></html>');
        return res.end();
    }

    res.setHeader('content-type', 'text/html');
    res.write('<html><title>Welcome</title><h1>New User</h1>');
    res.write('<body><form action="/create-user" method="POST"><span>Username: </span><input type="text" name="username"/> <button type="submit">Send</button></form>');
    res.write('</body></html>');
    res.end();
};


module.exports = requestHandler;
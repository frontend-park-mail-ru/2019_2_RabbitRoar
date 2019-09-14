const http = require('http');
const fs = require('fs');
const path = require('path');

const options = {
    port: 8000,
    path: 'dist'
};

console.log(`Starting http server on ${options.port}.`);

const server = http.createServer((req, res) => {
    let file_path = req.url;

    if (file_path.endsWith('/')) {
        file_path += 'index.html';
    }

    file_path = path.join(options.path, file_path);

    fs.readFile(file_path, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.write('404');
        } else {
            res.write(data);
        }
        res.end();
        console.log(res.statusCode, req.url);
    });
});

server.listen(options.port);
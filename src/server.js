const http = require('http');
const logger = require('pino')();

function requestWithBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            resolve({
                headers: req.headers,
                method: req.method,
                payload: body,
                url: req.url,
                remoteAddress: req.connection.remoteAddress,
            });
        });
    });
}

async function requestNoBody(req) {
    return {
        headers: req.headers,
        method: req.method,
        payload: null,
        url: req.url,
        remoteAddress: req.connection.remoteAddress,
    };
}

async function go() {
    const server = http.createServer(async function (req, res) {
        let data = null;
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            data = await requestWithBody(req);
        }
        else {
            data = await requestNoBody(req);
        }
        logger.info(data);

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('{}');
        res.end();

    }).listen(7788);

    return server;
}
module.exports = {
    go
};
const http = require('http');
const logger = require('pino')();
const fs = require('fs');
const {promisify} = require("util");

const writeFile = promisify(fs.writeFile);

function requestWithBody(req) {
    return new Promise((resolve) => {
        let body = Buffer.alloc(0);
        req.on('data', chunk => {
            body = Buffer.concat([body, chunk]);
        });
        req.on('end', async () => {
            const bodyString = body.toString('base64');
            await writeFile(`./data/${Date.now()}.dat`, bodyString);

            resolve({
                headers: req.headers,
                method: req.method,
                payload: `{body of length: ${bodyString.length}}`,
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
    return http.createServer(async function (req, res) {
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
}

module.exports = {
    go
};
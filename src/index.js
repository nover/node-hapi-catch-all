const server = require('./server');
server
    .go()
    .then((srv) => {
        console.log('server started');
    })
    .catch(console.error);
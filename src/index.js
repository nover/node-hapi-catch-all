const server = require('./server');


server
    .go()
    .then((info) => {
        console.log('server started', info);
    })
    .catch(console.error);
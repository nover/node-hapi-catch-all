const Hapi = require('hapi');

/**
 *
 * @param {pino} logger A pino logger instance
 */
async function go() {
    const server = new Hapi.Server({
        port: 7788
    });
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: false,
            logPayload: true,
            instance: require('pino')()
        }
    });

    server.route({
        method: '*',
        path: '/{path*}',
        handler: async (req, h) => {
            req.logger.info('In handler %s', req.path)
            return {};
        }
    });

    await server.start();

    return server.info;
}


module.exports = {
    go,
};
require('make-promises-safe');
const pino = require('pino');
const logger = pino({
    level: 'debug',
});
const {promisify} = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function doIt() {

    const args = require('minimist')(process.argv.slice(2), {
        alias: {
            h: 'help',
            e: 'encoding',
            o: 'output-file',
            i: 'input-file',
        }
    });
    logger.info(args);

    let encoding = args.encoding;
    if (!encoding) {
        logger.info('no encoding set, defaulting to utf-8');
        encoding = 'utf-8';
    }
    const outputFile = args["output-file"];
    if (!outputFile) {
        logger.fatal('no output file set, abort');
        process.exit(-1);
    }
    const inputFile = args['input-file'];
    if (!inputFile) {
        logger.fatal('no input file set, abort');
        process.exit(-2);
    }
    const inputRaw = await readFileAsync(inputFile, 'binary');
    const outputData = Buffer.from(inputRaw, 'base64').toString(encoding);
    await writeFileAsync(outputFile, outputData);

    return 'decode complete';
}

doIt()
    .then((result) => logger.info(result))
    .catch((err) => logger.error(err));

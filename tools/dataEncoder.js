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
            o: 'output-file',
            i: 'input-file',
        }
    });
    logger.info(args);

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

    const inputData = Buffer.from(await readFileAsync(inputFile), 'binary');
    const outputData = inputData.toString('base64');
    await writeFileAsync(outputFile, outputData);

    return 'decode complete';
}

doIt()
    .then((result) => logger.info(result))
    .catch((err) => logger.error(err));

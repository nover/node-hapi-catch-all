# hapi catch all

This repo contains a very minimal hapi API that responds to all verbs and paths, and simply logs the path it's handling including the full request payload.

Useful for capturing PSP callbacks or similar where the documentation from a given provider is not fullfilling enough.

## Running it
Requires nodejs 8 or newer to run.

```bash
yarn start
```

To just run it, or

```bash
yarn start:dev
```

To start with hot-reloading enabled.

To format the output nicely, do:

```bash
yarn global add pino
```

And start like:

```bash
yarn start|pino #or: yarn start:dev|pino
```
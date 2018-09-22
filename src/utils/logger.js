const pino = require('pino');

const logger = pino({
  prettyPrint: {
    levelFirst: true,
  },
});

module.exports.logger = logger;

const { logger } = require('src/utils/logger');

const formatError = (e) => {
  logger.error(e);

  switch (true) {
    case e.name === 'BadRequest':
      return { statusCode: 400, message: e.message || 'BadRequest' };

    default:
      return { statusCode: 500, message: e.message || 'Erreur interne du serveur' };
  }
};

const throwError = (name = 'UnknownError', message = '') => {
  const error = new Error(message);
  error.name = name;
  throw error;
};

module.exports.formatError = formatError;
module.exports.throwError = throwError;

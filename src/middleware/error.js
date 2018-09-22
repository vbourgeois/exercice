const { formatError } = require('src/utils/error');

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { statusCode, message } = formatError(err);

  return res.status(statusCode).send(message);
};

module.exports.errorMiddleware = errorMiddleware;

const asyncRequest = asyncFn => (req, res, next) => asyncFn(req, res, next).catch(e => next(e));

module.exports = asyncRequest;

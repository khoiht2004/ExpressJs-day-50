function exceptionHandler(error, req, res, next) {
  return res.error(500, error.message, error);
}

module.exports = exceptionHandler;

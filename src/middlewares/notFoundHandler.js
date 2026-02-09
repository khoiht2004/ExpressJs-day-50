function notFoundHandler(req, res, next) {
  return res.error(404, "Resource not found");
}

module.exports = notFoundHandler;

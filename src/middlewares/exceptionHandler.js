const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");

function exceptionHandler(error, req, res, next) {
  if (error instanceof JsonWebTokenError) {
    return res.error(401, "Unauthorized");
  }

  if (error instanceof TokenExpiredError) {
    return res.error(401, "Token expired");
  }

  return res.error(
    500,
    process.env.NODE_ENV !== "production"
      ? error.message
      : "Internal server error",
  );
}

module.exports = exceptionHandler;

function responseFormat(req, res, next) {
  res.success = (status = 200, data) => {
    res.status(status).json({
      status: "Success",
      data,
    });
  };

  res.error = (status, message) => {
    res.status(status).json({
      status: "Error",
      message,
    });
  };

  next();
}

module.exports = responseFormat;

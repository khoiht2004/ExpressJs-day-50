function responseFormat(req, res, next) {
  res.success = (data, status = 200) => {
    res.status(status).json({
      status: "Success",
      data,
    });
  };

  res.error = (status, message, error = null) => {
    res.status(status).json({
      status: "Error",
      error,
      message,
    });
  };

  next();
}

module.exports = responseFormat;

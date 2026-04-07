const multer = require("multer");

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Kích thước file vượt quá 3MB" });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err.message === "Loại file không hợp lệ, chỉ chấp nhận jpeg, png, webp") {
    return res.status(400).json({ message: err.message });
  }
  next(err);
}

module.exports = handleMulterError;

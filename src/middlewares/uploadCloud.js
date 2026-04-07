const { cloudinaryConfig } = require('@/config');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
      cloudinary: cloudinaryConfig,
      params: {
            folder: 'products',
      },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Loại file không hợp lệ, chỉ chấp nhận jpeg, png, webp"), false);
  }
};

const limits = {
  fileSize: 3 * 1024 * 1024,
};

const uploadCloud = multer({ storage: storage, fileFilter, limits })

module.exports = uploadCloud;
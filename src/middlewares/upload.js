const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "../../public/uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;

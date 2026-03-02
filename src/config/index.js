// const database = require("./database.config");
// const auth = require("./auth.config");

// module.exports = {
//   database,
//   auth,
// };

const fs = require("node:fs");
const path = require("node:path");
const PATH_DIR = path.resolve(__dirname, "./");
const postfix = ".config.js";

const fileNames = fs
  .readdirSync(PATH_DIR)
  .filter((file) => file !== "index.js");

const configs = fileNames.reduce((obj, fileName) => {
  return {
    ...obj,
    [fileName.replace(postfix, "Config")]: require(`./${fileName}`),
  };
}, {});

module.exports = configs;

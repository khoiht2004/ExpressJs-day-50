// const responseFormat = require("./responseFormat");
// const notFoundHandler = require("./notFoundHandler");
// module.exports = { responseFormat, notFoundHandler };

const fs = require("node:fs");
const path = require("node:path");
const PATH_DIR = path.resolve(__dirname, "../middlewares");

// console.log(PATH_DIR);

const fileNames = fs
  .readdirSync(PATH_DIR)
  .filter((file) => file !== "index.js");

const middlewares = fileNames.reduce((obj, fileName) => {
  return {
    ...obj,
    [fileName.replace(".js", "")]: require(`./${fileName}`),
  };
}, {});

// console.log(middleware);

module.exports = middlewares;

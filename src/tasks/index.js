const { readdirSync } = require("node:fs");

const postfix = ".task.js";
const jobs = readdirSync(__dirname)
  .filter((fileName) => fileName !== "index.js")
  .reduce((obj, fileName) => {
    const type = fileName.replace(postfix, "");
    return {
      ...obj,
      [type]: require(`./${fileName}`),
    };
  }, {});

module.exports = jobs;

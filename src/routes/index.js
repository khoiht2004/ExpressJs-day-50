const fs = require("node:fs");
const express = require("express");
const router = express.Router();

const basePath = "./src/routes";
const postfix = ".route.js";

fs.readdirSync(basePath)
  .filter((_fileName) => _fileName.endsWith(postfix))
  .forEach((fileName) => {
    const resource = fileName.replace(postfix, "");
    router.use(`/${resource}`, require(`./${fileName}`));
  });

module.exports = router;

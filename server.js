require("module-alias/register");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const {
  notFoundHandler,
  exceptionHandler,
  responseFormat,
} = require("@/middlewares");
const { apiRateLimiter } = require("@/middlewares/rateLimiter");
const router = require("@/routes");

const app = express();

// Cấu hình CORS
const corsOptions = {
  origin: ["http://localhost:5173", "https://khoiht2004.github.io"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middlewares
app.use(responseFormat);

app.use("/api", apiRateLimiter);
app.use("/api", router);

// 404 và Error handlers cuối cùng
app.use(notFoundHandler);
app.use(exceptionHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

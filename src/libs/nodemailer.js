const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: mailConfig.fromAddress,
    pass: mailConfig.googleAppPassword,
  },
});

module.exports = { transporter };

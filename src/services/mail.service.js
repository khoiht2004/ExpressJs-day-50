const { transporter } = require("../libs/nodemailer");
const mailConfig = require("../config/mail.config");
const authConfig = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const path = require("path");
const { formatTime } = require("../utils/helper");

class MailService {
  getTemplatePath(template) {
    return path.resolve(
      __dirname,
      "../",
      "templates",
      "mail",
      `${template.replace(".ejs", "")}.ejs`,
    );
  }

  async send(options) {
    const { template, templateData, ...restOptions } = options;
    const templatePath = this.getTemplatePath(template);
    const html = await ejs.renderFile(templatePath, templateData);

    const infor = await transporter.sendMail({ ...restOptions, html });
    return infor;
  }

  async sendVerificationEmail(user) {
    const { email } = user;
    const { fromAddress } = mailConfig;
    const expiresInSeconds = 60 * 60 * 2; // 2 giờ
    const timeExp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const hoursExp = formatTime(expiresInSeconds);

    const payload = { sub: user.id, exp: timeExp };
    const token = jwt.sign(payload, authConfig.verifyJwtSecret);
    const verifyUrl = `http://localhost:5713/verify-email?token=${token}`;

    return await this.send({
      from: `Demo send Email <${fromAddress}>`,
      to: email,
      subject: "Verify your email address",
      template: "auth/verificationEmail",
      templateData: {
        verifyUrl,
        hoursExp,
      },
    });
  }

  async sendPasswordChangeEmail(user) {
    const { email } = user;
    const { fromAddress } = mailConfig;
    const changedAt = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    return await this.send({
      from: `Demo send Email <${fromAddress}>`,
      to: email,
      subject: "Password changed successfully",
      template: "auth/changePasswordEmail",
      templateData: {
        changedAt,
      },
    });
  }

  async sendBackupDatabaseEmail(user) {
    const { email } = user;
    const { fromAddress } = mailConfig;
    const backupTime = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    return await this.send({
      from: `Demo send Email <${fromAddress}>`,
      to: email,
      subject: "Backup database successfully",
      template: "toast/backupDatabaseEmail",
      templateData: {
        backupTime,
      },
    });
  }
}

module.exports = new MailService();

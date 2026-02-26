const { transporter } = require("../libs/nodemailer");
const mailConfig = require("../config/mail.config");
const authConfig = require("../config/auth.config");
const jwt = require("jsonwebtoken");

const { formatTime } = require("../utils/helper");

class MailService {
  async sendVerificationEmail(user) {
    const { email } = user;
    const { fromAddress } = mailConfig;
    const expiresInSeconds = 60 * 60 * 2; // 2 giờ
    const timeExp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const hoursExp = formatTime(expiresInSeconds);

    const payload = { sub: user.id, exp: timeExp };
    const token = jwt.sign(payload, authConfig.verifyJwtSecret);
    const verifyUrl = `http://localhost:5713/verify-email?token=${token}`;

    const info = await transporter.sendMail({
      from: `Demo send Email <${fromAddress}>`,
      to: email,
      subject: "Verify your email address",
      html: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Xác minh Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background:#000000;padding:10px;">
              <h1 style="margin:12px 0 0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.3px;">
                Xác minh địa chỉ Email
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 24px;">
              <p style="margin:0 0 8px;color:#374151;font-size:15px;">Xin chào,</p>
              <p style="margin:0 0 24px;color:#6B7280;font-size:14px;line-height:1.6;">
                Bạn vừa đăng ký tài khoản. Vui lòng nhấn nút bên dưới để xác minh địa chỉ email và kích hoạt tài khoản của bạn.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}"
                      style="display:inline-block;padding:13px 36px;background:#000;color:#ffffff;
                             text-decoration:none;border-radius:6px;font-size:15px;font-weight:600;
                             letter-spacing:0.3px;">
                      Xác minh Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;color:#9CA3AF;font-size:12px;line-height:1.6;">
                Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.<br/>
                Liên kết sẽ hết hạn sau <strong>${hoursExp}</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 40px 28px;border-top:1px solid #F3F4F6;">
              <p style="margin:0;color:#D1D5DB;font-size:11px;text-align:center;">
                © 2025 YourApp. Tất cả quyền được bảo lưu.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
          </html>`,
    });
  }
}

module.exports = new MailService();

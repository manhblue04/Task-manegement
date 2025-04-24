const nodemailer = require("nodemailer");
console.log("🧪 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🧪 EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Có" : "Không có")

module.exports.sendMail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // App Password nếu bật 2FA
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Lỗi khi gửi email:", error);
    throw error; // để controller biết có lỗi
  }
};

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text,filePath = null) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  if (filePath) {
    mailOptions.attachments = [{ filename: "invoice.pdf", path: filePath }];
  }
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

class EmailService {
  static async sendInviteEmail(
    usrObj,
    password = undefined,
    tokenUrl = undefined,
  ) {
    let otherText;
    const usrEmail = usrObj.email;
    const subject = 'Welcome to Spacely App';

    const welcomeText = `Welcome ${password ? 'Admin' : ''} ${
      usrObj.fullname
    } to the spacely Api service.

    `;
    if (password) {
      otherText = `Here are your login credentials:
    email: ${usrEmail}
    password: ${password}`;
    } else {
      otherText = `Here is your verification URL:
      ${tokenUrl}

      Note that this URL will expire in 30 days time
      `;
    }
    const text = `${welcomeText}${otherText}`;
    this.sendEmail(usrEmail, subject, text);
  }

  static async sendEmail(email, subject, text) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SERVICE_EMAIL,
      to: email,
      subject,
      text,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = EmailService;

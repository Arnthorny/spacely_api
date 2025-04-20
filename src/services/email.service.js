require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const { genAdminSetupEmail, genInviteSetupEmail } = require('../templates');

class EmailService {
  static async sendAdminSetupEmail(admin, temporaryPassword) {
    await admin.populate('org');

    const adminEmail = admin.email;
    const subject = 'Welcome to Spacely App';
    const organisationName = admin.org.name;

    const html = genAdminSetupEmail(
      organisationName,
      adminEmail,
      temporaryPassword,
    );

    this.sendEmail(adminEmail, subject, undefined, html);
  }

  static async sendInviteEmail(user, tokenUrl) {
    await user.populate('org');

    const userEmail = user.email;
    const recipientName = user.fullname;
    const invitationLink = tokenUrl;
    const expiryDays = process.env.INV_EXP_DAYS;
    const subject = 'Welcome to Spacely App';
    const organisationName = user.org.name;

    const html = genInviteSetupEmail(
      organisationName,
      recipientName,
      invitationLink,
      expiryDays,
    );

    this.sendEmail(userEmail, subject, undefined, html);
  }

  static async sendEmail(email, subject, text = undefined, html = undefined) {
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
      to: `Spacely ${email}`,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = EmailService;

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
    const signInURL = `${process.env.APP_URL}/signin`;

    const html = genAdminSetupEmail(
      organisationName,
      adminEmail,
      temporaryPassword,
      signInURL,
    );

    const attachments = [
      {
        filename: 'logo.png',
        href: 'https://placehold.co/1800x600/2C6ECB/FFFFFF/png?text=Spacely&font=Raleway',
        cid: 'feb3c508c06060bd2d5feb0c0470deeb',
      },
    ];

    this.sendEmail(adminEmail, subject, undefined, html, attachments);
  }

  static async sendInviteEmail(user, tokenUrl) {
    await user.populate('org');

    const userEmail = user.email;
    const recipientName = user.fullName;
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

    const attachments = [
      {
        filename: 'logo.png',
        href: 'https://placehold.co/1800x600/2C6ECB/FFFFFF/png?text=Spacely&font=Raleway',
        cid: 'feb3c508c06060bd2d5feb0c0470deeb',
      },
    ];


    this.sendEmail(userEmail, subject, undefined, html, attachments);
  }

  static async sendEmail(
    email,
    subject,
    text = undefined,
    html = undefined,
    attachments = undefined,
  ) {
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
      from: `Spacely <${process.env.SERVICE_EMAIL}>`,
      to: email,
      subject,
      text,
      html,
      attachments,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = EmailService;

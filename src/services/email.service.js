require('dotenv').config();

class EmailService {
  static async sendInviteEmail(
    usrObj,
    password = undefined,
    tokenUrl = undefined,
  ) {
    // BUG Logic for development only!!!
    // TODO Send email containing credentials

    // eslint-disable-next-line no-console
    console.log(usrObj.email, password, tokenUrl);
  }
}

module.exports = EmailService;

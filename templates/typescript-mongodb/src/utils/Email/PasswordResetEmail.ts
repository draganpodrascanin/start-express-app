import Email from './Email';
import { UserDocument } from '../../models/User';
import { EmailTemaplates } from './EmailTemplate';

class PasswordResetEmail extends Email {
  private url: string;
  constructor(user: UserDocument, url: string) {
    super(user), (this.url = url);
  }

  async sendPasswordReset() {
    await this.send(
      EmailTemaplates['passwordReset'],
      'Your password reset token (valid for only 10 minutes)',
      { url: this.url }
    );
  }
}

export default PasswordResetEmail;

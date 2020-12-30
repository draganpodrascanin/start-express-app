import Email from './Email';

class ResetPasswordEmail extends Email {
	constructor(user, url) {
		super(user);
		this.url = url;
	}

	async sendPasswordReset() {
		console.log('sending email');
		await this.send(
			'passwordReset',
			'Your password reset token (valid for only 10 minutes)',
			{ url: this.url }
		);
	}
}

export default ResetPasswordEmail;

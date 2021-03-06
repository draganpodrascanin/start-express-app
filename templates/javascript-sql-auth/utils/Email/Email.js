import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';

/*
    this class is made mainly to send
    emails to registered users of our app
    you can make another class or modify 
    this one for your needs

    class accepts user model, and url (for resset password.. etc..)
    and has methods for sending specific emails
*/

export default class Email {
	from = `Start Express App <${process.env.EMAIL_FROM}>`;

	constructor(user) {
		this.to = user.email;
	}

	newTransport() {
		//you don't have to use sendgrid ofcourse
		if (process.env.NODE_ENV === 'production') {
			// Sendgrid
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	// Send the email method
	async send(template, subject, options) {
		// 1) Render HTML based on a pug template
		const html = pug.renderFile(
			`${__dirname}/../../views/email/${template}.pug`,
			{
				subject,
				...options,
			}
		);

		// 2) Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html),
		};

		// 3) Create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to my express app!');
	}
}

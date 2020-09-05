const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

/*
    this class is made mainly to send
    emails to registered users of our app
    you can make another class or modify
    this one for your needs
*/

export default class EmailCustom {
  public to: string;
  public from = `Start Express App <${process.env.EMAIL_FROM}>`;

  constructor(
    email: string,
    public subject: string,
    public text: string,
    public url: string
  ) {
    this.to = email;
    this.url = url;
    this.subject = subject;
    this.text = text;
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
  async send() {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/customEmail.pug`, {
      url: this.url,
      subject: this.subject,
      text: this.text,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
}

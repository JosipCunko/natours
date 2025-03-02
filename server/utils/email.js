const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const htmlToText = require("html-to-text");

// Read HTML templates
const EmailTemplate = fs.readFileSync(
  path.join(__dirname, "../public/templates/EmailTemplate.html"),
  "utf-8"
);
const PasswordResetTemplate = fs.readFileSync(
  path.join(__dirname, "../public/templates/PasswordResetTemplate.html"),
  "utf-8"
);

// new Email(user, url).sendWelcome()
// new Email(user, url).sendPasswordReset()
// ...

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `ultra brzi ${process.env.EMAIL_FROM}`;
  }

  createTransport() {
    if (process.env.NODE_ENV === "production") {
      //Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    //Gmail - not a good idea for a production app, more likely for a private app
    return nodemailer.createTransport({
      // service: "Gmail", //Yahoo, Hotmail...
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //Activate in gmail "less secure app" option (for gmail provider)
    });
  }
  async send(subject, message) {
    // 1) Render HTML template
    let html;
    if (message) {
      html = PasswordResetTemplate.replace(/{{subject}}/g, subject)
        .replace(/{{message}}/g, message)
        .replace(/{{firstName}}/g, this.firstName)
        .replace(/{{url}}/g, this.url);
    } else {
      html = EmailTemplate.replace(/{{subject}}/g, subject)
        .replace(/{{firstName}}/g, this.firstName)
        .replace(/{{url}}/g, this.url);
    }

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("Welcome to the Natours Family!");
  }
  async sendPasswordReset(message) {
    await this.send("Your password reset token. (Valid for 10 mins)", message);
  }
};

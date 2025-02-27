const nodemailer = require("nodemailer");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const EmailTemplate = require("../../client/app/_components/EmailTemplateParsed");
const PasswordResetTemplate = require("../../client/app/_components/PasswordResetTemplateParsed");
const htmlToText = require("html-to-text");

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
    // 1) Render React template to HTML
    let html;
    if (message) {
      html = ReactDOMServer.renderToString(
        React.createElement(PasswordResetTemplate, {
          subject,
          name: this.firstName,
          url: this.url,
          message,
        })
      );
    } else {
      html = ReactDOMServer.renderToString(
        React.createElement(EmailTemplate, {
          subject,
          name: this.firstName,
          url: this.url,
        })
      );
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

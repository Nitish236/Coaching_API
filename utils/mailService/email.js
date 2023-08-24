require("dotenv").config();

// Template engine
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const { MailError } = require("../../errors/mailError");

// Selecting the Service
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views/"),
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

// Send Email (Login Credentials)

const sendEmail = async (user) => {
  let emailOptions = {
    from: process.env.MAIL,
    to: user.email,
    subject: "Welcome Mail",
    template: "email",
    context: user.context,
  };

  transporter.sendMail(emailOptions, async (error) => {
    if (error) {
      throw new MailError("Something wrong happened while Sending Mail");
    }
  });
};

// Export Functionality

module.exports = {
  sendEmail
};

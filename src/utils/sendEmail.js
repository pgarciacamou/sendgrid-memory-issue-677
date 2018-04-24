const _ = require("lodash");
const Promise = require("promise-polyfill");
const logger = require("heroku-logger");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const envConfig = require("../../env.config.js");

sgMail.setApiKey(envConfig.SENDGRID_API_KEY);

const parseTemplateAndSend = ({ to, from, subject, template, data }) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(template, data, (err, html) => {
      if (err) {
        logger.info("ejs::email", { to, from });
        logger.info("ejs::error", { err });
        logger.info("ejs::data", { data });

        return reject({
          message: "There was an error compiling the email."
        });
      }

      // this implementation has to be changed to send multiple emails at the
      // same time instead, but for the purposes of this demo, this is the only
      // thing that was changed and tested.
      sgMail
        .send({ to, from, subject, html })
        .then((response) => {
          logger.info("sendgrid", response);
          resolve(response);
        }).catch((error) => {
          // error is an instance of SendGridError
          // The full response is attached to error.response
          logger.info("sendgrid::error", error);
          reject({
            error,
            message: "There was an error sending the email."
          });
        });
    });
  });
};

function sendEmail(emails) {
  return Promise.all(_.map(emails, parseTemplateAndSend));
}

module.exports = sendEmail;

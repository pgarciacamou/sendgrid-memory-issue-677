const _ = require("lodash");
const Promise = require("promise-polyfill");
const logger = require("heroku-logger");
const sendgrid = require("sendgrid");
const ejs = require("ejs");
const envConfig = require("../../env.config.js");
const sg = sendgrid(envConfig.SENDGRID_API_KEY);

const toPromiseEmailRequest = ({ to, from, subject, template, data }) => {
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

      const request = sg.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: {
          personalizations: [{
            to: _.map(to, (email) => ({ email })),
            subject: subject
          }],
          from: { email: from },
          content: [{
            type: "text/html",
            value: html
          }]
        }
      });

      sg.API(request).then((response) => {
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
  return Promise.all(_.map(emails, toPromiseEmailRequest));
}

module.exports = sendEmail;

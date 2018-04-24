const _ = require("lodash");
const fetch = require("node-fetch");
const logger = require("heroku-logger");
const { G_RECAPTCHA_SECRET_KEY } = require("../../env.config.js");
const { ERROR_CODES, VERIFICATION_URL } = require("../constants/GoogleReCaptcha.js");

const buildURL = (response = "") => {
  return `${VERIFICATION_URL}?secret=${G_RECAPTCHA_SECRET_KEY}&response=${response}`;
};

const verifyCaptcha = (req) => {
  const response = req.body["g-recaptcha-response"];
  const verificationURL = buildURL(response);

  return fetch(verificationURL)
    .then(res => res.json())
    .then(res => _.mapKeys(res, (v, k) => _.camelCase(k)))
    .then(res => {
      const { success = false, errorCodes } = res;
      const errors = _.map(errorCodes, (errKey) => ERROR_CODES[errKey]);

      if(!success) {
        logger.info("reCAPTCHA was not valid", res);
      }

      return success
        ? { status: 200, success }
        : { status: 401, success, errors };
    });
};

module.exports = verifyCaptcha;

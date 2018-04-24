const _ = require("lodash");
const path = require("path");
const router = require("express").Router();
const envConfig = require("../../env.config.js");
const verifyCaptcha = require("../utils/verifyCaptcha");
const toCamelCase = require("../utils/toCamelCase");
const sendEmail = require("../utils/sendEmail");
const emailPartialPath = path.join(__dirname, "..", "partials", "email.ejs");

router.post("/request", function (req, res) {
  const defaultData = {
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    agreeToTerms: "",
    email: ""
  };
  const data = _.pick(req.body, _.keys(defaultData));
  const formattedData = _.assign({}, defaultData, toCamelCase(data));
  const { email } = formattedData;

  verifyCaptcha(req).then(({ success, status, errors }) => {
    if(!success) {
      return res.status(status).json({ success, errors });
    }

    const emails = [
      {
        template: emailPartialPath,
        data: formattedData,
        to: [envConfig.FORWARDING_EMAIL],
        from: "no-reply@example.com",
        subject: `Request from ${email.substring(0, 23)}`
      },
      // { // Confirmation email
      //   to: [email, envConfig.FORWARDING_EMAIL],
      //   from: "no-reply@example.com",
      //   subject: "Email confirmation",
      //   html: "<p>We got your eamil, this is a confirmation.</p>"
      // }
    ];

    sendEmail(emails)
      .then(() => res.status(200).json({ success: true }))
      .catch(() => res.status(500).json({ success: false }));
  });
});

module.exports = router;

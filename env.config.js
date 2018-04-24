const DEV_PORT = 5000;
module.exports = {
  PORT: process.env.PORT || DEV_PORT,
  ENV_PROD: process.env.NODE_ENV === "production",
  ENV_DEV: process.env.NODE_ENV !== "production",
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || null,
  FORWARDING_EMAIL: process.env.FORWARDING_EMAIL || "no-reply@example.com",
  G_RECAPTCHA_SECRET_KEY: process.env.G_RECAPTCHA_SECRET_KEY || "",
};

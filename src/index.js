#!/usr/bin/env node
/* global __dirname, setTimeout */
const express = require("express");
const helmet = require("helmet");
const logger = require("heroku-logger");
const emails = require("./controllers/emails.js");
const envConfig = require("../env.config.js");

logger.info("Initializing server application...");
const app = express();

// for parsing application/json
app.use(express.json());

// secure express app by setting various HTTP headers
app.use(helmet());

// Check for correct origin to add extra security
app.use("/", function(req, res, next) {
  // allow CORS requests
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  // but only trust certain domains to access the API
  const origin = req.headers.origin;
  logger.debug(origin);

  /*
   * NOTE:
   *   a security feature was removed from the original code for privacy
   *   currently, any domain can make a call to the server.
   */
  const isDomainAllowed = true;

  if (envConfig.ENV_PROD && !isDomainAllowed) {
    logger.info(`DENIED request from ${origin}`);
    res.end(); // not allowed (do not answer, could be an attack)
  } else {
    logger.info(`Request coming from ${origin}`);
    next();
  }
});

logger.info("Initializing routes...");
app.use("/emails", emails);

// 404
app.use("*", (req, res) => {
  res.sendStatus(404);
});

const server = app.listen(envConfig.PORT);
logger.info(`Server listening on port ${envConfig.PORT}!`);

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
const gracefulShutdown = () => {
  logger.info("");
  logger.info("Received kill signal");
  logger.info("Trying to shut down gracefully...");
  server.close(function() {
    logger.info("Graceful shutdown executed successfully");
    logger.info("Closed out remaining connections");
    logger.info("Shutting down server");
    process.exit();
  });

  // if after 1.5 seconds it doesn't exit, force quit it
  setTimeout(function() {
    logger.error("Graceful shutdown timedout");
    logger.error("Forcing shutdown");
    process.exit();
  }, 1.5 * 1000);
};

// listen for TERM signal .e.g. kill
process.on("SIGTERM", gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on("SIGINT", gracefulShutdown);

// listen for unhandledRejection (stop server if there was any issues with node)
process.on("unhandledRejection", gracefulShutdown);

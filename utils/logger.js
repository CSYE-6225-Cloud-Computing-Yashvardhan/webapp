require('dotenv').config();
const { createLogger, format, transports } = require('winston');
const webappDir = require('app-root-path');
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: webappDir + "/logs/csye6225.log",
    }),
  ],
});

module.exports = {
  logger
};

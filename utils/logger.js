require('dotenv').config();
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "/home/csye6225/webapp/log/csye6225.log",
    }),
  ],
});

module.exports = {
  logger
};

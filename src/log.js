const winston = require("winston");
const path = require("path");
const { isDebug } = require("./svc/settings");
const { LOG_FILE } = require("./constants");

const format = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.align(),
  winston.format.printf((info) => {
    if (info.meta && info.meta instanceof Error) {
      info.message = `${info.message} ${info.meta.stack}`;
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

module.exports = function () {
  return winston.createLogger({
    format,
    transports: [
      new winston.transports.File({
        filename: LOG_FILE,
        maxsize: 1048576,
        maxFiles: 5,
      }),
    ],
    level: isDebug() ? "silly" : "info",
  });
};

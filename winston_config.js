const appRoot = require('app-root-path');
const winston = require('winston');
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/winston-test.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    format: combine(
      label({ label: 'WST' }),
      timestamp(),
      myFormat
    )
  },

  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(
      label({ label: 'WINSTON' }),
      timestamp(),
      myFormat
    )
  }
};

let logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file)
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console(options.console))
};

module.exports = logger;

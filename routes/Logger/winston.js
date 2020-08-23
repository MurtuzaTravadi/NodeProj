var winston = require('winston');
  require('winston-daily-rotate-file');
var path = require('path')
var moment = require('moment')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.json()
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: path.join(process.cwd()+ '/logs',moment().format("DD-MM-YY")+'-error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(process.cwd()+ '/logs',moment().format("DD-MM-YY")+'-combined.log') })
  ]
});


module.exports.logger = logger
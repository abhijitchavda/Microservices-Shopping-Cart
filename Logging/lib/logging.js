const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston');
const req = require('http');
require('winston-mongodb').MongoDB;



const requestLogger = expressWinston.logger({
  transports: [
    new(winston.transports.MongoDB)({
             db : 'mongodb://localhost:27017/nodeauth',
             collection: 'requestlogs',
             expireAfterSeconds: 2
     })
  ],
  meta: false,
  //msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}",
  expressFormat: true,
  //metaField: "{{req.url}}",
  //responseFilter: function(res, statusCode){ return res[statusCode]}

})


const errorLogger = expressWinston.errorLogger({
  transports: [
    new(winston.transports.MongoDB)({
             db : 'mongodb://localhost:27017/nodeauth',
             collection: 'errorlogs',
            // expireAfterSeconds: 2;
     })
  ],
  meta: false
});


module.exports = {
  requestLogger: requestLogger,
  errorLogger: errorLogger,
  error: winston.error,
  warn: winston.warn,
  info: winston.info,
  log: winston.log,
  verbose: winston.verbose,
  debug: winston.debug,
  silly: winston.silly
};

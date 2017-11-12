
const fs = require('fs');
const path = require('path');
const winston = require('../lib/winston');

const filename = path.join(__dirname, 'user_logfile.log');


// Remove the file, ignoring any errors

try { fs.unlinkSync(filename); }
catch (ex) { }


// Create a new winston logger instance with two tranports: Console, and File

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename })
  ]
});

logger.log('info', 'User activity is being logged here!', { 'username': 'nevosial' });

setTimeout(function () {
  // Remove the file, ignoring any errors.
  try { fs.unlinkSync(filename); }
  catch (ex) { }
}, 1000);

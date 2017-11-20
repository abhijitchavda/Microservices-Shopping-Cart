const winston = require('winston');
require('winston-mongodb').MongoDB;
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir ='log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

//const tsFormat = () => (new Date()).toLocaleTimeString();
var date = new Date();
const tsFormat = date;

const logger = new (winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      timestamp: tsFormat,   //added timestamp
      colorize: true,       // colorize.
    }),
    //Added a new transport to write logs to a file.
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      //level: env === 'development' ? 'debug' : 'info'  //log all 'info' messages.
      level: env === 'development' ? 'debug' : 'verbose'  //log all messages.
    }),
    //Added a new transport to write log data to the logs collection in MongoDB.
    new(winston.transports.MongoDB)({
            db : 'mongodb://localhost:27017/logSystem',
            collection: 'logs'
    })
  ]
});

//logger.level = 'debug';

logger.info('Hello world');
logger.debug('Debugging info');
logger.verbose('Lots of data...');
logger.warn('Warning message');
logger.error('Error info');

/***To be used on express server. 
Will log the hits to respective api when used.

***/
//Logging httpRequest
logger.info(`${req.url} endpoint hit`,{
  httpRequest:{
    status: res.statusCode,
    requestUrl: req.url,
    requestMethod: req.method,
    remoteIp: req.connection.remoteAddress,
  }
});


/****
2017-11-20T00:28:56.345Z - info: / endpoint hit 
{ httpRequest: 
   { status: 200,
     requestUrl: '/',
     requestMethod: 'GET',
     remoteIp: '::1' } }
*****/







